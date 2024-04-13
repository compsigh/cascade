import { get } from '@vercel/edge-config'
import { incrementTeamTime } from '@/functions/db'
import { fetchRiddleParts } from '@/functions/notion'

import { Spacer } from '@/components/Spacer'
import { RiddleTimer } from '@/components/RiddleTimer'
import Link from 'next/link'
import { Route } from 'next'

export async function RiddleWrapper() {
  const riddleContent = await fetchRiddleParts()
  const partNumber = await get('part') as number
  const timerOn = await get('timerOn') as boolean
  const timerToggleTimestamp = await get('timerToggleTimestamp') as number

  async function logTeamTimeServerAction(
    teamId: string,
    time: number
  ) {
    'use server'
    await incrementTeamTime(teamId, time)
  }

  if (!timerOn)
    return (
      <>
        <h1 id="title"><code className="blackCode">cascade</code></h1>
        <Spacer size={32} />
        <p>the clock is not ticking at the moment.</p>
        <p>feel free to chill &amp; hang out — we&apos;ll let you know when we&apos;re ready to go!</p>
      </>
    )

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
      <ul>
        <li>
          <Link href={'https://compsigh.notion.site/riddle-one-2aff8fe4a08d4ce6a2dec0c420ba7b65?pvs=4'}>riddle part one</Link>
        </li>
        <li>
          <Link href={'https://compsigh.notion.site/riddle-two-34dae013c366434cb0f841924780b899?pvs=4'}>riddle part two</Link>
        </li>
        <li>
          <Link href={'https://compsigh.notion.site/riddle-three-683fc44142324fc08eaff17c1f819209?pvs=4'}>riddle part three</Link>
        </li>
      </ul>
    </>
  )
}
