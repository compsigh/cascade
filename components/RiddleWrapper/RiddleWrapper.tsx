import { get } from '@vercel/edge-config'
import { incrementTeamTime } from '@/functions/db'
import { fetchRiddleParts } from '@/functions/notion'

import { Spacer } from '@/components/Spacer'
import { RiddleTimer } from '@/components/RiddleTimer'

export async function RiddleWrapper() {
  const riddleContent = await fetchRiddleParts()
  const partNumber = await get('part') as number
  const timerOn = await get('timerOn') as boolean
  const timerToggleTimestamp = await get('timerToggleTimestamp') as number

  async function incrementTeamTimeServerAction(
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
      <h2>part {partNumber}</h2>
      <p>{riddleContent[partNumber - 1]}</p>
    </>
  )
}
