import {
  getTeamByParticipantEmail,
  getTeamRiddleProgresses
} from "@/functions/db/teams"
import { auth } from "@/auth"
import { get } from "@vercel/edge-config"
import { redirect } from "next/navigation"
import { isAuthed, isOrganizer } from "@/functions/user-management"

import Link from "next/link"
import { Spacer } from "@/components/Spacer"
import { RiddleTimer } from "@/components/RiddleTimer"

export default async function Riddles() {
  const session = await auth()
  const authed = isAuthed(session)

  if (!session || !authed) redirect("/")

  const eventStarted = (await get("eventStarted")) as boolean

  if (!eventStarted && !isOrganizer(session)) redirect("/")

  const participantEmail = session.user!.email!

  const team = await getTeamByParticipantEmail(participantEmail)

  const timerToggleTimestamp = (await get("timerToggleTimestamp")) as number

  if (!team) return null

  const riddleProgresses = await getTeamRiddleProgresses(team.id)
  return (
    <>
      <RiddleTimer
        on={eventStarted}
        millisecondsSinceStart={Date.now() - timerToggleTimestamp}
      />
      <Spacer size={32} />
      <p>the riddle is available now!</p>
      <p>first one to finish all of them wins!</p>
      <p>good luck!</p>
      <ul>
        {riddleProgresses.map((riddleProgress) => (
          <li key={riddleProgress.riddleNumber}>
            <Link href={`/riddles/${riddleProgress.riddleNumber}`}>
              {riddleProgress.riddleNumber}:
              {riddleProgress.completed ? "completed" : "incomplete"}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
