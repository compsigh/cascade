import { auth } from '@/auth'
import { isAuthed, isOrganizer } from '@/functions/user-management'
import {
  getAllTeams
 } from '@/functions/db'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'
import { revalidatePath } from 'next/cache'
import { removeParticipantFromTeam } from '@/functions/db'

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed)
    redirect('/')

  const teams = await getAllTeams()

  async function removeFromTeamServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      email: formData.get('email') as string
    }

    revalidatePath('/admin')
    return await removeParticipantFromTeam(rawFormData.email)
  }

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
              {team.participants.map((participant) => (
                <li key={participant.email}>{participant.email}
                  <form action={removeFromTeamServerAction}>
                    <input type="hidden" name="email" value={participant.email} />
                    <Button type="submit" text="remove from team" />
                  </form>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  )
}
