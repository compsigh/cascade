import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function listParticipants() {
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

export async function deleteParticipants() {
  const users = await prisma.participant.deleteMany()
  return users
}

export async function listTeams() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true
    }
  })

  return teams
}

export async function createTeam(name: string, email: string) {
  const team = await prisma.team.create({
    data: {
      participants: {
        connect: {
          name,
          email
        }
      }
    }
  })

  return team
}

export async function deleteTeams() {
  const teams = await prisma.team.deleteMany()
  return teams
}
