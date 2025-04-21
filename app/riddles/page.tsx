import {
  getTeamByParticipantEmail,
  getTeamRiddleProgresses
} from "@/functions/db/teams"
import { auth } from "@/auth"
import { get } from "@vercel/edge-config"
import { redirect } from "next/navigation"
import { isAuthed, isOrganizer } from "@/functions/user-management"

import Link from "next/link"

export default async function Riddles() {
  const session = await auth()
  const authed = isAuthed(session)
  if (!session || !authed) redirect("/")

  const eventStarted = (await get("eventStarted")) as boolean
  if (!eventStarted && !isOrganizer(session)) redirect("/")

  const participantEmail = session.user!.email!
  const team = await getTeamByParticipantEmail(participantEmail)
  if (!team) return null

  const riddleProgresses = await getTeamRiddleProgresses(team.id)
  return (
    <>
      <h2>riddles</h2>
      <p>first team to finish all of them wins!</p>
      <p>good luck!</p>
      <ul>
        {riddleProgresses.map((riddleProgress) => (
          <li key={riddleProgress.riddleNumber}>
            {riddleProgress.completed ? (
              <>RIDDLE {riddleProgress.riddleNumber}: COMPLETE</>
            ) : (
              <Link href={`/riddles/${riddleProgress.riddleNumber}`}>
                RIDDLE {riddleProgress.riddleNumber}:{" "}
                {riddleProgress.completed ? "COMPLETE" : "INCOMPLETE"}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
