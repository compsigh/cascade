import { auth } from '@/auth'
import type { Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { isAuthed } from '@/functions/user-management'
import {
  createParticipant,
  getParticipantByEmail,
  getTeamById
} from '@/functions/db'

import { get } from '@vercel/edge-config'
import { revalidatePath } from 'next/cache'

import { Spacer } from '@/components/Spacer'
import { Button } from '@/components/Button'
import { TeamView } from '@/components/TeamView'
import { InviteForm } from '@/components/InviteForm'
import { RiddleWrapper } from '@/components/RiddleWrapper'
import { CountdownWrapper } from '@/components/CountdownWrapper'
import { IncomingInviteList } from '@/components/IncomingInviteList'
import { OutgoingInviteList } from '@/components/OutgoingInviteList'

function Welcome(
  { participantName }:
  { participantName: string }
) {
  return (
    <>
      <p>welcome {participantName.split(' ')[0].toLowerCase()},</p>
    </>
  )
}

function EventCountdown() {
  const EVENT_START_TIME = 1729301400
  return (
    <p>
      the event will begin in {' '}
      <code className="invert">
        <CountdownWrapper
          date={EVENT_START_TIME * 1000}
          autoStart={true}
          revealedOnCompletion={<span>just a moment</span>}
        />
      </code>
    </p>
  )
}

function Unregistered(
  { participantName, participantEmail }:
  { participantName: string, participantEmail: string }
) {
  async function signUpServerAction() {
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
      <EventCountdown />
      <TeamView participantEmail={participantEmail} />
      <IncomingInviteList participantEmail={participantEmail} />
      <InviteForm participantEmail={participantEmail} />
      <OutgoingInviteList participantEmail={participantEmail} />
    </>
  )
}

async function Content({ session }: { session: Session }) {
  const participantName = session.user!.name!
  const participantEmail = session.user!.email!

  const participant = await getParticipantByEmail(participantEmail)
  const team = await getTeamById(participant?.teamId || '')
  const eventStarted = await get('eventStarted') as boolean

  if (!participant) {
    return (
      <Unregistered
        participantName={participantName}
        participantEmail={participantEmail}
      />
    )
  }

  if (team && eventStarted)
    return <RiddleWrapper teamId={team.id} />

  return (
    <RegisteredAndWaiting
      participantName={participantName}
      participantEmail={participantEmail}
    />
  )
}

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
