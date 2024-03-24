import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import {
  getAllParticipants,
  getAllTeams
 } from '@/functions/db'
import { redirect } from 'next/navigation'

export default async function AdminPanel() {
  const session = await auth()
  if (!session)
    redirect('/')
  const authed = checkAuth(session)
  if (!authed)
    redirect('/')

  const participants = await getAllParticipants()
  const teams = await getAllTeams()

  return (
    <>
      <h1>Admin Panel</h1>
      <h2>Participants</h2>
      <ul>
        {participants.map(participant => (
          <li key={participant.email}>{participant.email}</li>
        ))}
      </ul>
      <h2>Teams</h2>
      <ul>
        {teams.map(team => (
          <li key={team.id}>{team.id}</li>
        ))}
      </ul>
    </>
  )
}
