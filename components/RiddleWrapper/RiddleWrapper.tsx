import Link from 'next/link'
import { get } from '@vercel/edge-config'
import { logTeamTime } from '@/functions/db'
import { getTeamById } from '@/functions/db'

import { Spacer } from '@/components/Spacer'
import { RiddleTimer } from '@/components/RiddleTimer'


export async function RiddleWrapper(
  { teamId }:
  { teamId: string }
) {
  const timerOn = await get('timerOn') as boolean
  if (!timerOn)
    return (
      <>
        <h1 id="title"><code className="blackCode">cascade</code></h1>
        <Spacer size={32} />
        <p>the clock is not ticking at the moment.</p>
        <p>feel free to chill &amp; hang out — we&apos;ll let you know when we&apos;re ready to go!</p>
      </>
    )

  const timerToggleTimestamp = await get('timerToggleTimestamp') as number

  const team = await getTeamById(teamId)
  if (!team)
    return null
  const partOneDone = team.partOneDone
  const partTwoDone = team.partTwoDone
  const partThreeDone = team.partThreeDone
  const millisecondsSinceStart = Date.now() - timerToggleTimestamp

  if (partOneDone && partTwoDone && partThreeDone)
    await logTeamTime(teamId, millisecondsSinceStart)

  return (
    <>
      <RiddleTimer
        on={timerOn}
        millisecondsSinceStart={Date.now() - timerToggleTimestamp}
      />
      <Spacer size={32} />
      <p>all of the parts are available now.</p>
      <p>you have 90 minutes to complete all three.</p>
      <p>good luck!</p>
      {
        !partOneDone
          ?
            <p>
              <Link href={'/one'}>riddle one</Link>
            </p>
          :
            <p><s>riddle one</s></p>
      }
      {
        !partTwoDone
          ?
            <p>
              <Link href={'/two'}>riddle two</Link>
            </p>
          :
            <p><s>riddle two</s></p>
      }
      {
        !partThreeDone
          ?
            <p>
              <Link href={'/three'}>riddle three</Link>
            </p>
          :
            <p><s>riddle three</s></p>
      }
    </>
  )
}
