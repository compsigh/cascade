import { auth } from '@/auth'
import type { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/functions/user-management'
import {
  createParticipant,
  getParticipantByEmail,
} from '@/functions/db'

import { get } from '@vercel/edge-config'
import { revalidatePath } from 'next/cache'
import { fetchRiddleParts } from '@/functions/notion'

import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'
import { Welcome } from '@/components/Welcome'
import { TeamView } from '@/components/TeamView'
import { InviteForm } from '@/components/InviteForm'
import { CountdownWrapper } from '@/components/CountdownWrapper'
import { IncomingInviteList } from '@/components/IncomingInviteList'
import { OutgoingInviteList } from '@/components/OutgoingInviteList'

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

  const participantExists = await getParticipantByEmail(participantEmail)
  const eventStarted = await get('eventStarted') as boolean

  if (eventStarted)
    return <Started />

  if (participantExists)
    return (
      <RegisteredAndWaiting
        participantName={participantName}
        participantEmail={participantEmail}
      />
    )

  return (
    <Unregistered
      participantName={participantName}
      participantEmail={participantEmail}
    />
  )
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
  { participantName, participantEmail }:
  { participantName: string, participantEmail: string }
) {
  async function signUpServerAction(formData: FormData) {
    'use server'
    const participantExists = await getParticipantByEmail(participantEmail)
    if (!participantExists)
      await createParticipant(participantName, participantEmail)
    revalidatePath('/event')
  }
  return (
    <>
      <Welcome participantName={participantName} />
      <p>
        to register for &amp; participate in compsigh <code>cascade</code>, lock in your spot below.
      </p>
      <Spacer size={32} />
      <form action={signUpServerAction}>
        <Button type="submit" text="lock in" />
      </form>
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

async function Started() {
  const riddleParts = await fetchRiddleParts()
  return (
    <>
      <Spacer size={2} />
      <code className="blackCode centered">
        <CountdownWrapper
            autoStart={true}
            date = {Date.now() + 1800000}
        />
      </code>
      <Spacer size={2} />
      <ul>
        {riddleParts.map((riddlePart, index) => (
          <li key={index}>
            {riddlePart}
          </li>
        ))}
      </ul>
    </>
  )
}
