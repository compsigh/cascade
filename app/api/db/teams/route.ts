import { protectRoute, Role } from '@/functions/protect-route'
import {
  deleteAllParticipantsAndTeams,
  getAllTeams
 } from '@/functions/db'

export async function GET(request: Request) {
  await protectRoute(Role.Participant)
  const teams = await getAllTeams()
  return new Response(
    JSON.stringify(teams), { status: 200 }
  )
}

export async function DELETE(request: Request) {
  await protectRoute(Role.Organizer)
  const deletedParticipantsAndTeams = await deleteAllParticipantsAndTeams()
  return new Response(
    JSON.stringify(deletedParticipantsAndTeams), { status: 200 }
  )
}
