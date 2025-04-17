import Link from "next/link";
import { get } from "@vercel/edge-config";
import { getAllTeamRiddleProgress, getTeamByEmail } from "@/functions/db";

import { Spacer } from "@/components/Spacer";
import { RiddleTimer } from "@/components/RiddleTimer";
import { auth } from "@/auth";
import { isAuthed, isOrganizer } from "@/functions/user-management";
import { redirect } from "next/navigation";

export default async function Riddles() {
  const session = await auth();
  const authed = isAuthed(session);

  if (!session || !authed) redirect("/");

  const eventStarted = (await get("eventStarted")) as boolean;

  if (!eventStarted && !isOrganizer(session)) redirect("/");

  const participantEmail = session.user!.email!;

  const team = await getTeamByEmail(participantEmail);

  const timerToggleTimestamp = (await get("timerToggleTimestamp")) as number;

  if (!team) return null;

  const riddleProgresses = await getAllTeamRiddleProgress(team.id);
  return (
    <>
      <RiddleTimer
        on={eventStarted}
        millisecondsSinceStart={Date.now() - timerToggleTimestamp}
      />
      <Spacer size={32} />
      <p>the riddle is available now!</p>
      <p>you have 30 minutes to complete it.</p>
      <p>good luck!</p>
      <ul>
        {riddleProgresses.map((riddleProgress) => (
          <li key={riddleProgress.riddleNumber}>
            <Link href={`/riddle/${riddleProgress.riddleNumber}`}>
              {riddleProgress.riddleNumber}:
              {riddleProgress.completed ? "completed" : "incomplete"}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
