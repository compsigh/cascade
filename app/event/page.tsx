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
import { Welcome } from '@/components/Welcome'
import { get } from '@vercel/edge-config'

export default async function Event() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed)
    redirect('/')

  return (
    <>
      <Content session={session} />
    </>
  )
}

async function Content({ session }: { session: Session }) {
  const participantName = session.user!.name!
  const participantEmail = session.user!.email!

  const registered = await hasParticipantRegistered(participantEmail)
  const participantExists = await getParticipantByEmail(participantEmail)
  const eventStarted = await get('eventStarted') as boolean

  if (registered && !participantExists)
    await createParticipant({
      name: participantName,
      email: participantEmail
    })

  if (eventStarted)
    return <Started />
  else if (registered || participantExists)
    return (
      <RegisteredAndWaiting
        participantName={participantName}
        participantEmail={participantEmail}
      />
    )
  else
    return <Unregistered participantName={participantName} />
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

async function Unregistered(
  { participantName }:
  { participantName: string }
) {
  return (
    <>
      <Welcome participantName={participantName} />
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

function RegisteredAndWaiting(
  { participantName, participantEmail }:
  { participantName: string, participantEmail: string }
) {
  return (
    <>
      <Welcome participantName={participantName} />
      <p>you&apos;ve registered for compsigh <code>cascade</code></p>
      <Countdown />
      <TeamView participantEmail={participantEmail} />
      <IncomingInviteList participantEmail={participantEmail} />
      <InviteForm participantEmail={participantEmail} />
      <OutgoingInviteList participantEmail={participantEmail} />
    </>
  )
}

function Started() {
  return (
    <>
      <Spacer size={2} />
      <code className="blackCode centered">
        <CountdownWrapper
            autoStart={true}
            date = {Date.now() + 1800000}
          />
        </code>
    </>
  )
}
