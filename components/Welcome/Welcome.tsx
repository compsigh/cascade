import { Spacer } from '@/components/Spacer'

export function Welcome(
  { participantName }:
  { participantName: string }
) {
  return (
    <>
      <h1 id="title"><code className="invert">cascade</code></h1>
      <Spacer size={32} />
      <p>welcome {participantName.split(' ')[0].toLowerCase()},</p>
    </>
  )
}
