import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function getAllParticipants() {
  const participants = await prisma.participant.findMany()
  return participants
}

export async function createParticipant(
  { name, email }:
  { name: string, email: string }
) {
  const participant = await prisma.participant.create({
    data: {
      name,
      email,
      team: {
        create: {}
      }
    }
  })

  return participant
}

export async function getParticipantByEmail(email: string) {
  const participant = await prisma.participant.findUnique({
    where: {
      email
    }
  })

  return participant
}

export async function deleteAllParticipants() {
  const users = await prisma.participant.deleteMany()
  return users
}

export async function getAllTeams() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true
    }
  })

  return teams
}

export async function addParticipantToTeam(
  email: string, teamId: string
) {
  const participant = await getParticipantByEmail(email)

  if (!participant)
    return null

  const formerTeam = await prisma.team.findUnique({
    where: {
      id: participant.teamId
    },
    include: {
      participants: true
    }
  })

  await prisma.participant.update({
    where: {
      email
    },
    data: {
      teamId
    }
  })

  if (formerTeam && formerTeam.participants.length === 1)
    await prisma.team.delete({
      where: {
        id: formerTeam.id
      }
    })

  return await getParticipantByEmail(email)
}

export async function deleteAllParticipantsAndTeams() {
  const participants = await prisma.participant.deleteMany()
  const teams = await prisma.team.deleteMany()
  return { participants, teams }
}
