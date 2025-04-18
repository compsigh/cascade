import { auth } from "@/auth"
import type { Session } from "next-auth"
import { redirect } from "next/navigation"
import { isAuthed } from "@/functions/user-management"
import {
  cancelInvite,
  createParticipant,
  getAllParticipants,
  getInvitesFromEmail,
  getParticipantByEmail,
  getTeamById,
  sendInvite
} from "@/functions/db"

import { get } from "@vercel/edge-config"
import { revalidatePath } from "next/cache"

import { Spacer } from "@/components/Spacer"
import { Button } from "@/components/Button"
import { TeamView } from "@/components/TeamView"
import { CountdownWrapper } from "@/components/CountdownWrapper"
import { IncomingInviteList } from "@/components/IncomingInviteList"
import { InviteSystem } from "@/components/InviteSystem"
import { Invite, Participant } from "@/generated/client"
import Link from "next/link"

function Welcome({ participantName }: { participantName: string }) {
  return (
    <>
      <p>welcome {participantName.split(" ")[0].toLowerCase()},</p>
    </>
  )
}

function EventCountdown() {
  const EVENT_START_TIME = 1745631000
  return (
    <p>
      the event will begin in{" "}
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

function Unregistered({
  participantName,
  participantEmail
}: {
  participantName: string
  participantEmail: string
}) {
  async function signUpServerAction() {
    "use server"
    const participantExists = await getParticipantByEmail(participantEmail)
    if (!participantExists)
      await createParticipant(participantName, participantEmail)
    revalidatePath("/event")
  }
  return (
    <>
      <Welcome participantName={participantName} />
      <p>
        to register for &amp; participate in compsigh <code>cascade</code>, lock
        in your spot below.
      </p>
      <Spacer size={32} />
      <form action={signUpServerAction}>
        <Button type="submit">lock in</Button>
      </form>
    </>
  )
}

async function sendInviteServerAction(
  from: string,
  to: string
): Promise<Invite> {
  "use server"
  revalidatePath("/event")
  return await sendInvite(from, to)
}

// Server action to cancel an invite
async function cancelInviteServerAction(id: string): Promise<Invite> {
  "use server"
  revalidatePath("/event")
  return await cancelInvite(id)
}

async function RegisteredAndWaiting({
  participant,
  eventStarted
}: {
  participant: Participant
  eventStarted: boolean
}) {
  const invitesSent = await getInvitesFromEmail(participant.email)
  const team = await getTeamById(participant.teamId)
  const teammates = team?.participants || []
  const allParticipants = await getAllParticipants()

  const maxTeamSize = await get<number>("maxTeamSize")
  const maxInvites = await get<number>("maxInvites")

  return (
    <>
      <Welcome participantName={participant.name} />
      <p>
        you&apos;ve registered for compsigh <code>cascade</code>
      </p>
      {eventStarted ? (
        <Link href="/riddles">Go to Riddles</Link>
      ) : (
        <EventCountdown />
      )}
      <TeamView participantEmail={participant.email} />
      {eventStarted ? (
        <p>Invites are closed, talk to leadership</p>
      ) : (
        <>
          <IncomingInviteList participantEmail={participant.email} />
          <InviteSystem
            participant={participant}
            allParticipants={allParticipants}
            initialInvitesSent={invitesSent}
            team={teammates}
            maxTeamSize={maxTeamSize!}
            maxInvites={maxInvites!}
            onSendInvite={sendInviteServerAction}
            onCancelInvite={cancelInviteServerAction}
          />
        </>
      )}
    </>
  )
}

async function Content({ session }: { session: Session }) {
  const participantName = session.user!.name!
  const participantEmail = session.user!.email!

  const participant = await getParticipantByEmail(participantEmail)
  const eventStarted = (await get("eventStarted")) as boolean
  if (!participant) {
    return (
      <Unregistered
        participantName={participantName}
        participantEmail={participantEmail}
      />
    )
  }

  return (
    <RegisteredAndWaiting
      participant={participant}
      eventStarted={eventStarted}
    />
  )
}

export default async function Event() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed) redirect("/")

  return (
    <>
      <Content session={session} />
    </>
  )
}
