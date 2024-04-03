import { auth } from '@/auth'
import { get } from '@vercel/edge-config'
import { redirect } from 'next/navigation'
import { Spacer } from '@/components/Spacer'
import { isAuthed } from '@/functions/user-management'
import { CountdownWrapper } from '@/components/CountdownWrapper'
import { Button } from '@/components/Button'
import { loadStripe } from '@stripe/stripe-js'
import {
  acceptInvite,
  cancelInvite,
  declineInvite,
  getInvitesFromEmail,
  getInvitesToEmail,
  getParticipantByEmail,
  getTeamById,
  sendInvite
} from '@/functions/db'
import { revalidatePath } from 'next/cache'

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
      <Countdown />
    </>
  )
}

async function Content({ email }: { email: string }) {
  const registered = true
  const started = await get('eventStarted')

  if (!registered)
    return <Unregistered />
  else if (registered && !started)
    return <RegisteredAndWaiting email={email} />
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

function RegisteredAndWaiting({ email }: { email: string }) {
  return (
    <>
      <p>you&apos;ve registered for compsigh <code>cascade</code></p>
      <Countdown />
      <TeamView participantEmail={email} />
      <IncomingInviteList participantEmail={email} />
      <InviteForm participantEmail={email} />
      <OutgoingInviteList participantEmail={email} />
    </>
  )
}

async function Unregistered() {
  await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
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

async function TeamView({ participantEmail }: { participantEmail: string }) {
  const participant = await getParticipantByEmail(participantEmail)
  const team = await getTeamById(participant!.teamId)
  const participants = team!.participants

  return (
    <>
      <Spacer size={16} />
      <h2>your team</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant.name}>{participant.name.toLowerCase()}</li>
        ))}
      </ul>
    </>
  )
}

async function InviteForm({ participantEmail }: { participantEmail: string }) {
  async function createInvite(formData: FormData) {
    'use server'

    const rawFormData = {
      from: formData.get('from') as string,
      to: formData.get('to') as string
    }

    revalidatePath('/event')
    return await sendInvite(rawFormData.from, rawFormData.to)
  }

  return (
    <>
      <Spacer size={16} />
      <h2>invite a friend to join your team</h2>
      <p>please be sure to enter their email exactly as it appears on their usf google account</p>
      <Spacer size={8} />
      <form action={createInvite}>
        <input type="hidden" name="from" value={participantEmail || ''} />
        <input type="email" name="to" placeholder="usf email" />
        <Spacer size={8} />
        <Button type="submit" text="send invite" />
      </form>
    </>
  )
}

async function IncomingInviteList({ participantEmail }: { participantEmail: string }) {
  async function acceptInviteServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      id: formData.get('id') as string,
      action: 'accept'
    }

    revalidatePath('/event')
    return await acceptInvite(rawFormData.id)
  }

  async function declineInviteServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      id: formData.get('id') as string,
      action: 'decline'
    }

    revalidatePath('/event')
    return await declineInvite(rawFormData.id)
  }

  const invites = await getInvitesToEmail(participantEmail)
  if (invites.length === 0)
    return <></>

  return (
    <>
      <Spacer size={16} />
      <h2>invites to you</h2>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            <p>from: {invite.fromParticipantEmail}</p>
            <form action={acceptInviteServerAction}>
              <input type="hidden" name="id" value={invite.id} />
              <Button type="submit" text="accept" />
            </form>
            <form action={declineInviteServerAction}>
              <input type="hidden" name="id" value={invite.id} />
              <Button type="submit" text="decline" />
            </form>
          </li>
        ))}
      </ul>
    </>
  )
}

async function OutgoingInviteList({ participantEmail }: { participantEmail: string }) {
  async function cancelInviteServerAction(formData: FormData) {
    'use server'

    const rawFormData = {
      id: formData.get('id') as string
    }

    revalidatePath('/event')
    return await cancelInvite(rawFormData.id)
  }

  const invites = await getInvitesFromEmail(participantEmail)
  if (invites.length === 0)
    return <></>

  return (
    <>
      <Spacer size={16} />
      <h2>invites you&apos;ve sent</h2>
      <ul>
        {invites.map((invite) => (
          <li key={invite.id}>
            <p>to: {invite.toParticipantEmail}</p>
            <form action={cancelInviteServerAction}>
              <input type="hidden" name="id" value={invite.id} />
              <Button type="submit" text="cancel" />
            </form>
          </li>
        ))}
      </ul>
    </>
  )
}
