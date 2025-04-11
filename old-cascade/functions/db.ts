import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function getTeamById(id: string) {
  const team = await prisma.team.findUnique({
    where: {
      id
    },
    include: {
      participants: true
    }
  })

  return team
}

export async function createParticipant(
  name: string,
  email: string
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

export async function deleteParticipant(email: string) {
  const participant = await getParticipantByEmail(email)

  if (!participant)
    return null

  await removeParticipantFromTeam(email)

  return await prisma.participant.delete({
    where: {
      email
    }
  })
}

export async function deleteAllParticipants() {
  const users = await prisma.participant.deleteMany()
  return users
}

export async function deleteTeam(id: string) {
  return await prisma.team.delete({
    where: {
      id
    }
  })
}

export async function deleteAllTeams() {
  const teams = await prisma.team.deleteMany()
  return teams
}

export async function deleteAllParticipantsAndTeams() {
  const participants = await prisma.participant.deleteMany()
  const teams = await prisma.team.deleteMany()
  return { participants, teams }
}

export async function getAllTeams() {
  const teams = await prisma.team.findMany({
    include: {
      participants: true
    },
    orderBy: {
      totalTime: 'asc'
    }
  })

  return teams
}

export async function updateParticipantTeam(
  email: string,
  teamId: string
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

  if (!formerTeam)
    return null

  if (formerTeam.id === teamId)
    return null

  // Set new team's participants to include participant
  await prisma.team.update({
    where: {
      id: teamId
    },
    data: {
      participants: {
        connect: {
          email
        }
      }
    }
  })

  // Remove the participant from their former team
  const otherParticipants = formerTeam.participants.filter(
    participant => participant.email !== email
  )

  await prisma.team.update({
    where: {
      id: formerTeam.id
    },
    data: {
      participants: {
        set: otherParticipants
      }
    }
  })

  // Clean up former team if it has no participants other than the one removed
  if (formerTeam.participants.length === 1)
    await prisma.team.delete({
      where: {
        id: formerTeam.id
      }
    })
}

export async function removeParticipantFromTeam(email: string) {
  const participant = await getParticipantByEmail(email)

  if (!participant)
    return null

  const currentTeam = await prisma.team.findUnique({
    where: {
      id: participant.teamId
    },
    include: {
      participants: true
    }
  })

  if (!currentTeam)
    return null

  // Create a new solo team for the participant
  await prisma.team.create({
    data: {
      participants: {
        connect: {
          email
        }
      }
    }
  })

  // Remove the participant from their former team
  const otherParticipants = currentTeam.participants.filter(
    participant => participant.email !== email
  )

  await prisma.team.update({
    where: {
      id: currentTeam.id
    },
    data: {
      participants: {
        set: otherParticipants
      }
    }
  })

  // Clean up former team if it has no participants other than the one removed
  if (currentTeam.participants.length === 1)
    await prisma.team.delete({
      where: {
        id: currentTeam.id
      }
    })
}

export async function sendInvite(
  from: string,
  to: string
) {
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

export async function getInvitesFromEmail(email: string) {
  const invites = await prisma.invite.findMany({
    where: {
      fromParticipantEmail: email
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

  await prisma.invite.delete({
    where: {
      id
    }
  })

  return await updateParticipantTeam(toParticipant.email, fromParticipantTeamId)
}

export async function declineInvite(id: string) {
  const invite = await prisma.invite.delete({
    where: {
      id
    }
  })

  return invite
}

export async function cancelInvite(id: string) {
  return await declineInvite(id)
}

export async function resetTeamTime(id: string) {
  return await prisma.team.update({
    where: {
      id
    },
    data: {
      totalTime: 0
    }
  })
}

export async function logTeamTime(id: string, time: number) {
  const team = await prisma.team.findUnique({
    where: {
      id
    }
  })

  if (!team)
    return null

  if (team.totalTime !== 0)
    return null

  return await prisma.team.update({
    where: {
      id
    },
    data: {
      totalTime: time
    }
  })
}

export async function updateTeamRiddleProgress(
  teamId: string,
  part: number,
  status: boolean
) {
  let property: 'partOneDone' | 'partTwoDone' | 'partThreeDone'
  if (part === 1)
    property = 'partOneDone'
  else if (part === 2)
    property = 'partTwoDone'
  else
    property = 'partThreeDone'

  return await prisma.team.update({
    where: {
      id: teamId
    },
    data: {
      [property]: status
    }
  })
}

export async function updateTeamRiddleProgressServerAction(formData: FormData) {
  'use server'
  const teamId = formData.get('teamId') as string
  const part = parseInt(formData.get('part') as string)
  const status = formData.get('status') === 'true'

  await updateTeamRiddleProgress(teamId, part, status)
  revalidatePath('/admin')
}

export async function validateInputServerAction(formData: FormData) {
  'use server'
  const teamId = formData.get('teamId') as string
  const part = formData.get('part') as string
  const answer = formData.get('answer') as string

  let solution = ''
  if (part === '1')
    solution = process.env.SOLUTION_PART_ONE as string
  if (part === '2')
    solution = process.env.SOLUTION_PART_TWO as string
  if (part === '3')
    solution = process.env.SOLUTION_PART_THREE as string

  if (answer === solution)
    await updateTeamRiddleProgress(teamId, parseInt(part), true)

  redirect('/event')
}
