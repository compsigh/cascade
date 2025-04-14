import Link from "next/link";
import { get } from "@vercel/edge-config";
import { getTeamById, logTeamTime } from "@/functions/db";

import { Spacer } from "@/components/Spacer";
import { RiddleTimer } from "@/components/RiddleTimer";

export async function RiddleWrapper({ teamId }: { teamId: string }) {
  const timerOn = (await get("timerOn")) as boolean;
  if (!timerOn) {
    return (
      <>
        <p>the clock is not ticking at the moment.</p>
        <p>
          feel free to chill &amp; hang out — we&apos;ll let you know when
          we&apos;re ready to go!
        </p>
      </>
    );
  }

  const timerToggleTimestamp = (await get("timerToggleTimestamp")) as number;

  const team = await getTeamById(teamId);
  if (!team) return null;
  const partOneDone = team.partOneDone;
  const partTwoDone = team.partTwoDone;
  const partThreeDone = team.partThreeDone;
  const millisecondsSinceStart = Date.now() - timerToggleTimestamp;

  if (partOneDone && partTwoDone && partThreeDone)
    await logTeamTime(teamId, millisecondsSinceStart);

  return (
    <>
      <RiddleTimer
        on={timerOn}
        millisecondsSinceStart={Date.now() - timerToggleTimestamp}
      />
      <Spacer size={32} />
      <p>the riddle is available now!</p>
      <p>you have 30 minutes to complete it.</p>
      <p>good luck!</p>
      <ul>
        {!partOneDone ? (
          <li>
            <Link href={"/riddle"}>open riddle</Link>
          </li>
        ) : (
          <li>
            <s>open riddle</s>
          </li>
        )}
        {!partThreeDone ? (
          <li>
            <Link href={"/riddles/three"}>open the next riddle</Link>
          </li>
        ) : (
          <li>
            <s>open the next riddle</s>
          </li>
        )}
      </ul>
    </>
  );
}
