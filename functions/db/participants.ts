import prisma from "@/functions/db"
import { deleteTeam } from "@/functions/db/teams"

export async function getAllParticipants() {
  const participants = await prisma.participant.findMany()
  return participants
}

export async function getParticipantByEmail(email: string) {
  const participant = await prisma.participant.findUnique({
    where: { email }
  })
  return participant
}

export async function createParticipant(name: string, email: string) {
  const riddles = await prisma.riddle.findMany()
  const participant = await prisma.participant.create({
    data: {
      name,
      email,
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
  return participant
}

export async function updateParticipantTeam(email: string, teamId: string) {
  const participant = await getParticipantByEmail(email)
  if (!participant) return null

  const formerTeam = await prisma.team.findUnique({
    where: { id: participant.teamId },
    include: { participants: true }
  })
  if (!formerTeam) return null
  if (formerTeam.id === teamId) return null

  // Set new team's participants to include participant
  await prisma.team.update({
    where: { id: teamId },
    data: {
      participants: {
        connect: { email }
      }
    }
  })

  // Remove the participant from their former team
  const otherParticipants = formerTeam.participants.filter(
    (participant) => participant.email !== email
  )
  await prisma.team.update({
    where: { id: formerTeam.id },
    data: {
      participants: {
        set: otherParticipants
      }
    }
  })

  // Clean up former team if it has no participants other than the one removed
  if (formerTeam.participants.length === 1) {
    await prisma.riddleProgress.deleteMany({
      where: { teamId: formerTeam.id }
    })
    await deleteTeam(formerTeam.id)
  }
}

export async function removeParticipantFromTeam(email: string) {
  const participant = await getParticipantByEmail(email)
  if (!participant) return null

  const currentTeam = await prisma.team.findUnique({
    where: { id: participant.teamId },
    include: { participants: true }
  })
  if (!currentTeam) return null
  if (currentTeam.participants.length === 1) return null

  const riddles = await prisma.riddle.findMany()

  return await prisma.$transaction(async (prisma) => {
    const newTeam = await prisma.team.create({
      data: {
        riddlesProgresses: {
          create: riddles.map((riddle) => ({
            riddleNumber: riddle.number,
            completed: false
          }))
        }
      }
    })

    await prisma.participant.update({
      where: { email },
      data: {
        team: {
          connect: { id: newTeam.id }
        }
      }
    })
  })
}

export async function deleteParticipant(email: string) {
  const participant = await getParticipantByEmail(email)
  if (!participant) return null

  const team = await prisma.team.findUnique({
    where: { id: participant.teamId },
    include: { participants: true }
  })
  if (!team) return null

  if (team.participants.length === 1) {
    await prisma.$transaction([
      prisma.riddleProgress.deleteMany({
        where: { teamId: team.id }
      }),
      prisma.participant.delete({
        where: { email }
      }),
      prisma.team.delete({
        where: { id: team.id }
      })
    ])
  } else {
    await prisma.participant.delete({
      where: { email }
    })
  }
}

export async function deleteAllParticipants() {
  const participants = await prisma.participant.deleteMany()
  await prisma.riddleProgress.deleteMany()
  const teams = await prisma.team.deleteMany()
  return { participants, teams }
}
