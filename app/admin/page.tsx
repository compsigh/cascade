import { auth } from '@/auth'
import { isAuthed, isOrganizer } from '@/functions/user-management'
import {
  getAllTeams,
  removeParticipantFromTeam,
  updateTeamRiddleProgressServerAction
 } from '@/functions/db'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'
import { revalidatePath } from 'next/cache'
import { get } from '@vercel/edge-config'

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed)
    redirect('/')

  const teams = await getAllTeams()
  const eventStarted = await get('eventStarted') as boolean
  const timerOn = await get('timerOn') as boolean
  const part = await get('part') as number

  async function removeFromTeamServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      email: formData.get('email') as string
    }

    revalidatePath('/admin')
    return await removeParticipantFromTeam(rawFormData.email)
  }

  async function toggleEventStatusServerAction() {
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

  async function updateTimerStatusServerAction() {
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
            items: [
              {
              operation: 'update',
              key: 'timerOn',
              value: !timerOn
            },
            {
              operation: 'update',
              key: 'timerToggleTimestamp',
              value: Date.now()
            }
          ]
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

  async function updatePartServerAction(formData: FormData) {
    'use server'
    const action = formData.get('action') as string
    const newPart = action === 'increment' ? part + 1 : part - 1
    if (newPart < 1 || newPart > 3)
      return

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
              key: 'part',
              value: newPart
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
      <h1 id="title"><code className="invert">cascade</code></h1>
      <Spacer size={32} />
      <h2>admin panel</h2>
      <h3>flags</h3>
      <ul>
        <li>
          <code>eventStarted</code>: {eventStarted?.toString()}
          <form action={toggleEventStatusServerAction}>
            <Button type="submit" text="toggle event status" />
          </form>
        </li>
        <li>
          <code>timerOn</code>: {timerOn?.toString()}
          <form action={updateTimerStatusServerAction}>
            <Button type="submit" text="toggle timer status" />
          </form>
        </li>
        <li>
          <code>part</code>: {part?.toString()}
          <form action={updatePartServerAction}>
            <input type="hidden" name="action" value="increment" />
            <Button type="submit" text="part++" />
          </form>
          <form action={updatePartServerAction}>
            <input type="hidden" name="action" value="decrement" />
            <Button type="submit" text="part--" />
          </form>
        </li>
      </ul>
      <h3>teams</h3>
      <ul>
        {teams.map(team => (
          <li key={team.id}>
            {team.id}
            <p>total team time: {team.totalTime}</p>
            <form action={updateTeamRiddleProgressServerAction}>
              <input type="hidden" name="teamId" value={team.id} />
              <input type="hidden" name="part" value="1" />
              <input type="hidden" name="status" value="false" />
              <Button type="submit" text="reset riddle one progress" />
            </form>
            <form action={updateTeamRiddleProgressServerAction}>
              <input type="hidden" name="teamId" value={team.id} />
              <input type="hidden" name="part" value="2" />
              <input type="hidden" name="status" value="false" />
              <Button type="submit" text="reset riddle two progress" />
            </form>
            <form action={updateTeamRiddleProgressServerAction}>
              <input type="hidden" name="teamId" value={team.id} />
              <input type="hidden" name="part" value="3" />
              <input type="hidden" name="status" value="false" />
              <Button type="submit" text="reset riddle three progress" />
            </form>
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
            <Spacer size={32} />
          </li>
        ))}
      </ul>
    </>
  )
}
