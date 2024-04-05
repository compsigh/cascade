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
import { get } from '@vercel/edge-config'

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed)
    redirect('/')

  const teams = await getAllTeams()
  const eventStarted = await get('eventStarted') as boolean

  async function removeFromTeamServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      email: formData.get('email') as string
    }

    revalidatePath('/admin')
    return await removeParticipantFromTeam(rawFormData.email)
  }

  async function toggleEventStatusServerAction(formData: FormData) {
    'use server'
    try {
      const result = await fetch(
        `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.VERCEL_TEAM_ID}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`
          },
          body: JSON.stringify({
            items: [{
              operation: 'update',
              key: 'eventStarted',
              value: !eventStarted
            }]
          })
        }).then(res => res.json())

      revalidatePath('/admin')
      return result
    }
    catch (error) {
      console.error(error)
      return error
    }
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
      <h3>Flags</h3>
      <ul>
        <li>
          <code>eventStarted</code>: {eventStarted?.toString()}
          <form action={toggleEventStatusServerAction}>
            <Button type="submit" text="toggle event status" />
          </form>
        </li>
      </ul>
    </>
  )
}
