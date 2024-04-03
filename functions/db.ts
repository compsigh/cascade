import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production')
  globalThis.prismaGlobal = prisma

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

export async function sendInvite(from: string, to: string) {
  const invite = await prisma.invite.create({
    data: {
      fromParticipantEmail: from,
      toParticipantEmail: to
    }
  })

  return invite
}

export async function getInvitesToEmail(email: string) {
  const invites = await prisma.invite.findMany({
    where: {
      toParticipantEmail: email
    }
  })

  return invites
}

export async function acceptInvite(id: string) {
  const invite = await prisma.invite.findUnique({
    where: {
      id
    }
  })

  if (!invite)
    return null

  const fromParticipant = await getParticipantByEmail(invite.fromParticipantEmail)
  if (!fromParticipant)
    return null
  const fromParticipantTeamId = fromParticipant.teamId

  const toParticipant = await getParticipantByEmail(invite.toParticipantEmail)
  if (!toParticipant)
    return null

  return await addParticipantToTeam(toParticipant.email, fromParticipantTeamId)
}

export async function declineInvite(id: string) {
  const invite = await prisma.invite.delete({
    where: {
      id
    }
  })

  return invite
}
