import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'
import {
  getParticipantByEmail,
  getTeamById,
  validateInputServerAction
} from '@/functions/db'
import { isAuthed } from '@/functions/user-management'

export default async function PartTwo() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed)
    redirect('/')

  const participant = await getParticipantByEmail(session.user!.email!)
  if (!participant)
    return null
  const team = await getTeamById(participant.teamId)
  if (!team)
    return null

  return (
    <>
      <h1 id="title"><code className="invert">cascade</code></h1>
      <Spacer size={32} />
      <p>riddle two is available now.</p>
      <p>good luck!</p>
      <p><Link href={'https://compsigh.notion.site/riddle-two-34dae013c366434cb0f841924780b899?pvs=4'}>open riddle two</Link> (same tab)</p>
      <Spacer size={32} />
      <form action={validateInputServerAction}>
        <input type="hidden" name="teamId" value={team.id} />
        <input type="hidden" name="part" value="2" />
        <input type="text" name="answer" placeholder="answer" />
        <Spacer size={8} />
        <Button type="submit" text="submit" />
      </form>
    </>
  )
}
