import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { isAuthed } from '@/functions/user-management'
import { CountdownWrapper } from '@/components/CountdownWrapper'
import { Button } from '@/components/Button'
import {
  createParticipant,
  getParticipantByEmail,
} from '@/functions/db'
import { hasParticipantRegistered } from '@/functions/stripe'
import type { Session } from 'next-auth'
import { TeamView } from '@/components/TeamView'
import { InviteForm } from '@/components/InviteForm'
import { IncomingInviteList } from '@/components/IncomingInviteList'
import { OutgoingInviteList } from '@/components/OutgoingInviteList'

export default async function Event() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed)
    redirect('/')

  return (
    <>
      <h1 id="title"><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>
        welcome {session.user!.name!.split(' ')[0].toLowerCase()},
      </p>
      <Content session={session} />
    </>
  )
}

async function Content({ session }: { session: Session }) {
  const registered = await hasParticipantRegistered(session.user!.email!)
  const participantExists = await getParticipantByEmail(session.user!.email!)
  if (registered && !participantExists)
    await createParticipant({ name: session.user!.name!, email: session.user!.email! })

  if (registered || participantExists)
    return <RegisteredAndWaiting participantEmail={session.user!.email!} />
  else
    return <Unregistered />
}

function Countdown() {
  return (
    <p>
      the event will begin in {' '}
      <code className="blackCode">
        <CountdownWrapper
          date={1712971800000}
          autoStart={true}
        />
      </code>
    </p>
  )
}

async function Unregistered() {
  return (
    <>
      <p>
        to register for &amp; participate in compsigh <code>cascade</code>, please grab your ticket below.
      </p>
      <Spacer size={32} />
      <ul>
        <li>
          <Button type="stripe" text="register" />
        </li>
      </ul>
    </>
  )
}

function RegisteredAndWaiting({ participantEmail }: { participantEmail: string }) {
  return (
    <>
      <p>you&apos;ve registered for compsigh <code>cascade</code></p>
      <Countdown />
      <TeamView participantEmail={participantEmail} />
      <IncomingInviteList participantEmail={participantEmail} />
      <InviteForm participantEmail={participantEmail} />
      <OutgoingInviteList participantEmail={participantEmail} />
    </>
  )
}
