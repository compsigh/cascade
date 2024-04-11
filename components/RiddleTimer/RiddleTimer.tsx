import { CountdownWrapper } from '@/components/CountdownWrapper'

export function RiddleTimer(
  { on, millisecondsSinceStart }:
  { on: boolean, millisecondsSinceStart: number }
) {
  return (
    <>
      <code className="blackCode centered">
        <CountdownWrapper
            autoStart={on}
            date = {Date.now() + 1800000 - millisecondsSinceStart}
        />
      </code>
    </>
  )
}
