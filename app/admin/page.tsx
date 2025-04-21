import { auth } from "@/auth"
import {
  toggleEventStatusServerAction,
  updateTimerStatusServerAction
} from "@/functions/actions/flags"
import {
  resetAllTeamRiddleProgressAction,
  dissolveAllTeamsServerAction
} from "@/functions/actions/teams"
import { get } from "@vercel/edge-config"
import { redirect } from "next/navigation"
import { getAllTeams } from "@/functions/db/teams"
import { getAllParticipants } from "@/functions/db/participants"
import { isAuthed, isOrganizer } from "@/functions/user-management"
import { deleteAllRiddlesServerAction } from "@/functions/actions/riddles"
import { deleteAllParticipantsServerAction } from "@/functions/actions/participants"

import { TeamTable } from "./TeamTable"
import { Button } from "@/components/Button"
import { CreateRiddleForm } from "./CreateRiddleForm"
import { CreateParticipantForm } from "./CreateParticipantForm"
import { AddParticipantToTeamForm } from "./AddParticipantToTeamForm"

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
      <CreateParticipantForm />
      <CreateRiddleForm />
      <AddParticipantToTeamForm participants={participants} teams={teams} />
    </>
  )
}
