import { auth } from '@/auth'
import { isAuthed, isOrganizer } from '@/functions/user-management'
import {
  getAllTeams
 } from '@/functions/db'
 import { redirect } from 'next/navigation'
 import { Spacer } from '@/components/Spacer'

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed)
    redirect('/')

  const teams = await getAllTeams()

  return (
    <>
      <h1 id="title"><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <h2>Admin Panel</h2>
      <h3>Teams</h3>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            {team.id}
            <ul>
              {team.participants.map(participant => (
                <li key={participant.email}>{participant.email}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}
