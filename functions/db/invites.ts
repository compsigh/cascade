import prisma from "@/functions/db"
import {
  getParticipantByEmail,
  updateParticipantTeam
} from "@/functions/db/participants"

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
    where: { toParticipantEmail: email }
  })
  return invites
}

export async function getInvitesFromEmail(email: string) {
  const invites = await prisma.invite.findMany({
    where: { fromParticipantEmail: email }
  })
  return invites
}

export async function acceptInvite(id: string) {
  const invite = await prisma.invite.findUnique({
    where: { id }
  })
  if (!invite) return null

  const fromParticipant = await getParticipantByEmail(
    invite.fromParticipantEmail
  )
  if (!fromParticipant) return null

  const toParticipant = await getParticipantByEmail(invite.toParticipantEmail)
  if (!toParticipant) return null

  await prisma.invite.delete({
    where: { id }
  })

  const fromParticipantTeamId = fromParticipant.teamId
  return await updateParticipantTeam(toParticipant.email, fromParticipantTeamId)
}

export async function declineInvite(id: string) {
  const invite = await prisma.invite.delete({
    where: { id }
  })
  return invite
}

export async function cancelInvite(id: string) {
  return await declineInvite(id)
}
