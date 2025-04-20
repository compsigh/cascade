import { auth } from "@/auth"
import { get } from "@vercel/edge-config"
import { redirect } from "next/navigation"
import {
  deleteAllParticipantsServerAction,
  deleteAllRiddlesServerAction,
  dissolveAllTeamsServerAction,
  resetAllTeamRiddleProgressAction,
  toggleEventStatusServerAction,
  updateTimerStatusServerAction
} from "@/functions/actions"
import { getAllParticipants, getAllTeams } from "@/functions/db"
import { isAuthed, isOrganizer } from "@/functions/user-management"

import { TeamTable } from "./TeamTable"
import { Button } from "@/components/Button"
import CreateRiddleAdminPanel from "./CreateRiddleAdminPanel"
import CreateParticipantAdminPanel from "./CreateParticipantAdminPanel"
import AddParticipantToTeamAdminPanel from "./AddParticipantToTeamAdminPanel"

export default async function AdminPanel() {
  const session = await auth()
  const authed = isAuthed(session) && isOrganizer(session)
  if (!session || !authed) redirect("/")

  const eventStarted = (await get("eventStarted")) as boolean
  const timerOn = (await get("timerOn")) as boolean
  const participants = await getAllParticipants()
  const teams = await getAllTeams()

  return (
    <>
      <h2>admin panel</h2>
      <h3>flags</h3>
      <ul>
        <li>
          <code>eventStarted</code>: {eventStarted?.toString()}
          <form action={toggleEventStatusServerAction}>
            <input
              type="hidden"
              name="eventStarted"
              value={String(eventStarted)}
            />
            <Button type="submit">toggle event status</Button>
          </form>
        </li>
        <li>
          <code>timerOn</code>: {timerOn?.toString()}
          <form action={updateTimerStatusServerAction}>
            <input type="hidden" name="timerOn" value={String(timerOn)} />
            <Button type="submit">toggle timer status</Button>
          </form>
        </li>
        <li>
          <form action={resetAllTeamRiddleProgressAction}>
            <Button type="submit">reset all team progresses</Button>
          </form>
        </li>
        <li>
          <form action={deleteAllParticipantsServerAction}>
            <Button type="submit">delete all participants</Button>
          </form>
        </li>
        <li>
          <form action={dissolveAllTeamsServerAction}>
            <Button type="submit">dissolve all teams</Button>
          </form>
        </li>
        <li>
          <form action={deleteAllRiddlesServerAction}>
            <Button type="submit">delete all riddles</Button>
          </form>
        </li>
      </ul>

      <TeamTable />
      <CreateParticipantAdminPanel />
      <CreateRiddleAdminPanel />
      <AddParticipantToTeamAdminPanel
        participants={participants}
        teams={teams}
      />
    </>
  )
}
