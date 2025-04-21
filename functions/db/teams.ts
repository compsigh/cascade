import prisma from "@/functions/db"
import { get } from "@vercel/edge-config"
import type { PrismaPromise } from "@/generated/client"

export type CompleteTeamData = {
  participants: {
    name: string
    email: string
    teamId: string
  }[]
} & {
  id: string
  totalTime: number
} & {
  riddlesProgresses: {
    teamId: string
    id: string
    completed: boolean
    mostRecentSubmission: Date
    riddleNumber: number
  }[]
}

export async function getTeamByParticipantEmail(email: string) {
  const participant = await prisma.participant.findUnique({
    where: { email },
    include: { team: true }
  })
  if (!participant) return null
  return participant.team
}

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({
    where: { id },
    include: {
      participants: true,
      riddlesProgresses: true
    }
  })
  return team
}

export async function getAllTeams() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true,
      riddlesProgresses: true
    },
    orderBy: {
      totalTime: "asc"
    }
  })
  return teams
}

export async function deleteTeam(id: string) {
  await prisma.riddleProgress.deleteMany({
    where: {
      teamId: id
    }
  })
  return await prisma.team.delete({
    where: { id },
    include: {
      participants: true
    }
  })
}

export async function addParticipantToTeam(
  participantEmail: string,
  newTeamId: string
) {
  const participant = await prisma.participant.findUnique({
    where: { email: participantEmail },
    include: { team: true }
  })

  if (!participant)
    throw new Error(`Participant with email ${participantEmail} not found`)

  const oldTeamId = participant.teamId

  if (!oldTeamId) {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId }
    })
    return
  }

  const oldTeam = await prisma.team.findUnique({
    where: { id: oldTeamId },
    include: { participants: true }
  })

  if (!oldTeam) throw new Error(`Old team with id ${oldTeamId} not found`)

  if (oldTeam.participants.length === 1) {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId }
    })

    await prisma.riddleProgress.deleteMany({
      where: { teamId: oldTeamId }
    })

    await prisma.team.delete({
      where: { id: oldTeamId }
    })
  } else {
    await prisma.participant.update({
      where: { email: participantEmail },
      data: { teamId: newTeamId }
    })
  }
}

export async function dissolveTeam(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { participants: true }
  })

  if (!team) return null

  if (team.participants.length === 1) return null

  const transaction: PrismaPromise<unknown>[] = []

  const riddles = await prisma.riddle.findMany()

  for (const participant of team.participants) {
    transaction.push(
      prisma.participant.update({
        where: { email: participant.email },
        data: {
          team: {
            create: {
              riddlesProgresses: {
                create: riddles.map((riddle) => ({
                  riddleNumber: riddle.number,
                  completed: false
                }))
              }
            }
          }
        }
      })
    )
  }

  transaction.push(
    prisma.riddleProgress.deleteMany({
      where: { teamId }
    })
  )

  transaction.push(
    prisma.team.delete({
      where: { id: teamId }
    })
  )

  // Run all operations in a transaction
  await prisma.$transaction(transaction)
}

export async function dissolveAllTeams() {
  const teams = await prisma.team.findMany({
    include: { participants: true }
  })

  for (const team of teams) {
    if (team.participants.length > 1) {
      const transaction: PrismaPromise<unknown>[] = []

      const riddles = await prisma.riddle.findMany()

      for (const participant of team.participants) {
        transaction.push(
          prisma.participant.update({
            where: { email: participant.email },
            data: {
              team: {
                create: {
                  riddlesProgresses: {
                    create: riddles.map((riddle) => ({
                      riddleNumber: riddle.number,
                      completed: false
                    }))
                  }
                }
              }
            }
          })
        )
      }

      transaction.push(
        prisma.riddleProgress.deleteMany({
          where: { teamId: team.id }
        })
      )

      transaction.push(
        prisma.team.delete({
          where: { id: team.id }
        })
      )

      await prisma.$transaction(transaction)
    }
  }
}

export async function resetTeamTime(id: string) {
  return await prisma.team.update({
    where: { id },
    data: {
      totalTime: 0
    }
  })
}

export async function logTeamTime(id: string, time: number) {
  const team = await prisma.team.findUnique({
    where: { id }
  })

  if (!team) return null
  if (team.totalTime !== 0) return null

  return await prisma.team.update({
    where: { id },
    data: {
      totalTime: time
    }
  })
}

export async function getTeamRiddleProgress(
  teamId: string,
  riddleNumber: number
) {
  return await prisma.riddleProgress.findUnique({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId
      }
    }
  })
}

export async function getTeamRiddleProgresses(teamId: string) {
  return await prisma.riddleProgress.findMany({
    where: { teamId },
    orderBy: {
      riddleNumber: "asc"
    }
  })
}

export async function resetAllTeamsRiddleProgresses() {
  try {
    const [teams, riddles] = await Promise.all([
      prisma.team.findMany(),
      prisma.riddle.findMany()
    ])

    const upsertOperations = teams.flatMap((team) =>
      riddles.map((riddle) =>
        prisma.riddleProgress.upsert({
          where: {
            teamId_riddleNumber: {
              teamId: team.id,
              riddleNumber: riddle.number
            }
          },
          update: { completed: false },
          create: {
            riddleNumber: riddle.number,
            teamId: team.id,
            completed: false
          }
        })
      )
    )

    await prisma.$transaction(upsertOperations)
  } catch (error) {
    console.error("Error resetting riddle progresses:", error)
    throw new Error("Failed to reset progress")
  }
}

// Check if a riddle for a team was last submitted in the past n seconds
export async function isRiddleSubmittedRecently(
  riddleNumber: number,
  teamId: string
): Promise<{ canSubmit: boolean; timeLeft: number }> {
  const progress = await prisma.riddleProgress.findUnique({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId
      }
    }
  })

  const cooldownSeconds = ((await get("cooldownTimer")) as number) || 60 // Default to 60 seconds if not configured

  if (!progress || !progress.mostRecentSubmission)
    return { canSubmit: true, timeLeft: 0 }

  const lastSubmittedTime = progress.mostRecentSubmission.getTime()
  const currentTime = Date.now()
  const diff = currentTime - lastSubmittedTime
  const timeLeft = Math.max(0, cooldownSeconds - diff / 1000) // Time left in seconds

  return { canSubmit: diff >= cooldownSeconds * 1000, timeLeft: timeLeft }
}

export async function getNumberOfCorrectRiddles(teamId: string) {
  return await prisma.riddleProgress.count({
    where: {
      teamId: teamId,
      completed: true
    }
  })
}

export async function hasTeamCompletedEveryRiddle(teamId: string) {
  const riddles = await prisma.riddle.findMany()
  const riddleCount = riddles.length

  const completedRiddlesCount = await prisma.riddleProgress.count({
    where: {
      teamId: teamId,
      completed: true
    }
  })

  return completedRiddlesCount === riddleCount
}

export async function updateSubmissionTime(
  riddleNumber: number,
  teamId: string
) {
  return await prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId
      }
    },
    data: {
      mostRecentSubmission: new Date()
    }
  })
}

export async function completeTeamRiddle(riddleNumber: number, teamId: string) {
  return await prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId
      }
    },
    data: {
      completed: true
    }
  })
}

export async function updateTeamRiddleProgress(
  teamId: string,
  riddleNumber: number,
  complete: boolean
) {
  return await prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        riddleNumber: riddleNumber,
        teamId: teamId
      }
    },
    data: {
      completed: complete
    }
  })
}
