'use client'

import Countdown from 'react-countdown'
import type { ReactElement } from 'react'

export function CountdownWrapper(
  { date, autoStart, revealedOnCompletion }:
  { date: number, autoStart: boolean, revealedOnCompletion?: ReactElement}
) {
  return (
    <Countdown
      date={date}
      autoStart={autoStart}
    >
      {revealedOnCompletion}
    </Countdown>
  )
}
