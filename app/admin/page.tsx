import { auth } from "@/auth";
import {
  deleteParticipantServerAction,
  removeParticipantFromTeamServerAction,
  resetTeamTimeServerAction,
  toggleEventStatusServerAction,
  updateTimerStatusServerAction,
} from "@/functions/actions";
import { getAllTeams, updateTeamRiddleProgressServerAction } from "@/functions/db";
import { isAuthed, isOrganizer } from "@/functions/user-management";
import { get } from "@vercel/edge-config";
import { redirect } from "next/navigation";

import { Button } from "@/components/Button";

export default async function AdminPanel() {
  const session = await auth();
  const authed = isAuthed(session) && isOrganizer(session);
  if (!session || !authed) {
    redirect("/");
  }

  const teams = await getAllTeams();
  const eventStarted = await get("eventStarted") as boolean;
  const timerOn = await get("timerOn") as boolean;

  return (
    <>
      <h2>admin panel</h2>
      <h3>flags</h3>
      <ul>
        <li>
          <code>eventStarted</code>: {eventStarted?.toString()}
          <form action={toggleEventStatusServerAction}>
            <input type="hidden" name="eventStarted" value={String(eventStarted)} />
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
      <h3>teams</h3>
      <table>
        <thead>
          <tr>
            <th>participants</th>
            <th>total time</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => (
            <tr key={team.id}>
              <td>
                <ul>
                  {team.participants.map(participant => (
                    <li key={participant.email}>
                      {participant.email}
                      <form action={removeParticipantFromTeamServerAction}>
                        <input type="hidden" name="email" value={participant.email} />
                        <Button type="submit">remove from team</Button>
                      </form>
                      <form action={deleteParticipantServerAction}>
                        <input type="hidden" name="email" value={participant.email} />
                        <Button type="submit">remove from event</Button>
                      </form>
                    </li>
                  ))}
                </ul>
              </td>
              <td>{team.totalTime}</td>
              <td>
                {team.partOneDone
                  && (
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="1" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit">reset riddle one</Button>
                    </form>
                  )}
                {team.partTwoDone
                  && (
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="2" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit">reset riddle two</Button>
                    </form>
                  )}
                {team.partThreeDone
                  && (
                    <form action={updateTeamRiddleProgressServerAction}>
                      <input type="hidden" name="teamId" value={team.id} />
                      <input type="hidden" name="part" value="3" />
                      <input type="hidden" name="status" value="false" />
                      <Button type="submit">reset riddle three</Button>
                    </form>
                  )}
                <form action={resetTeamTimeServerAction}>
                  <input type="hidden" name="teamId" value={team.id} />
                  <Button type="submit">reset time</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
