import { auth } from '@/auth'
import { get } from '@vercel/edge-config'
import { redirect } from 'next/navigation'
import { isAuthed, isOrganizer } from '@/functions/user-management'
import {
  getAllTeams,
  updateTeamRiddleProgressServerAction
} from '@/functions/db'
import {
  deleteParticipantServerAction,
  removeFromTeamServerAction,
  resetTeamTimeServerAction,
  toggleEventStatusServerAction,
  updatePartServerAction,
  updateTimerStatusServerAction
} from '@/functions/actions'

import { Button } from '@/components/Button'

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed)
    redirect('/')

  const teams = await getAllTeams()
  const eventStarted = await get('eventStarted') as boolean
  const timerOn = await get('timerOn') as boolean
  const part = await get('part') as number

  return (
    <>
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
      <table>
        <thead>
          <tr>
            <th>participants</th>
            <th>total time</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>
                <ul>
                  {team.participants.map(participant => (
                    <li key={participant.email}>
                      {participant.email}
                      <form action={removeFromTeamServerAction}>
                        <input type="hidden" name="email" value={participant.email} />
                        <Button type="submit" text="remove from team" />
                      </form>
                      <form action={deleteParticipantServerAction}>
                        <input type="hidden" name="email" value={participant.email} />
                        <Button type="submit" text="remove from event" />
                      </form>
                    </li>
                  ))}
                </ul>
              </td>
              <td>{team.totalTime}</td>
              <td>
                {
                  team.partOneDone &&
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="1" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit" text="reset riddle one" />
                    </form>
                }
                {
                  team.partTwoDone &&
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="2" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit" text="reset riddle two" />
                    </form>
                }
                {
                  team.partThreeDone &&
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="3" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit" text="reset riddle three" />
                    </form>
                }
                <form action={resetTeamTimeServerAction}>
                  <input type="hidden" name="teamId" value={team.id} />
                  <Button type="submit" text="reset time" />
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
