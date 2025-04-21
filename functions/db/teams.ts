import prisma from "@/functions/db"
import { get } from "@vercel/edge-config"
import { removeParticipantFromTeam } from "@/functions/db/participants"

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
    orderBy: { totalTime: "asc" }
  })
  return teams
}

export async function deleteTeam(id: string) {
  await prisma.riddleProgress.deleteMany({
    where: { teamId: id }
  })
  return await prisma.team.delete({
    where: { id },
    include: { participants: true }
  })
}

export async function disbandTeam(id: string) {
  const team = await getTeamById(id)
  if (!team) return null

  for (const participant of team.participants)
    await removeParticipantFromTeam(participant.email)

  return await deleteTeam(id)
}

export async function disbandAllTeams() {
  const teams = await getAllTeams()

  for (const team of teams) {
    for (const participant of team.participants)
      await removeParticipantFromTeam(participant.email)
    await prisma.riddleProgress.deleteMany({
      where: { teamId: team.id }
    })
    await deleteTeam(team.id)
  }

  return teams
}

export async function resetTeamTime(id: string) {
  return await prisma.team.update({
    where: { id },
    data: { totalTime: 0 }
  })
}

// Not used
export async function logTeamTime(id: string, time: number) {
  const team = await prisma.team.findUnique({
    where: { id }
  })

  if (!team) return null
  if (team.totalTime !== 0) return null

  return await prisma.team.update({
    where: { id },
    data: { totalTime: time }
  })
}

export async function getTeamRiddleProgress(
  teamId: string,
  riddleNumber: number
) {
  return await prisma.riddleProgress.findUnique({
    where: {
      teamId_riddleNumber: {
        teamId,
        riddleNumber
      }
    }
  })
}

export async function getTeamRiddleProgresses(teamId: string) {
  return await prisma.riddleProgress.findMany({
    where: { teamId },
    orderBy: { riddleNumber: "asc" }
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
        teamId,
        riddleNumber
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

// Not used
export async function getNumberOfCorrectRiddles(teamId: string) {
  return await prisma.riddleProgress.count({
    where: {
      teamId,
      completed: true
    }
  })
}

// Not used
export async function hasTeamCompletedEveryRiddle(teamId: string) {
  const riddles = await prisma.riddle.findMany()
  const riddleCount = riddles.length
  const completedRiddlesCount = await prisma.riddleProgress.count({
    where: {
      teamId,
      completed: true
    }
  })
  return completedRiddlesCount === riddleCount
}

export async function updateSubmissionTime(
  teamId: string,
  riddleNumber: number
) {
  return await prisma.riddleProgress.update({
    where: {
      teamId_riddleNumber: {
        teamId,
        riddleNumber
      }
    },
    data: { mostRecentSubmission: new Date() }
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
        teamId,
        riddleNumber
      }
    },
    data: { completed: complete }
  })
}
