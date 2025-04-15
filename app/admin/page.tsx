import { auth } from "@/auth";
import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";
import { isAuthed, isOrganizer } from "@/functions/user-management";
import { getAllTeamsParticipants } from "@/functions/db";
import {
  toggleEventStatusServerAction,
  updateTimerStatusServerAction,
} from "@/functions/actions";
import { Button } from "@/components/Button";
import AdminPanelClient from "./AdminPanelClient";
import TeamTable from "./TeamTable"; // Create this component

export default async function AdminPanel() {
  const session = await auth();
  const authed = isAuthed(session) && isOrganizer(session);
  if (!session || !authed) redirect("/");

  const teams = await getAllTeamsParticipants();
  const eventStarted = (await get("eventStarted")) as boolean;
  const timerOn = (await get("timerOn")) as boolean;

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
      </ul>

      <TeamTable />

      <AdminPanelClient />
    </>
  );
}
