import { Spacer } from '@/components/Spacer'
import { auth } from '@/auth'
import { isAuthed } from '@/functions/user-management'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default async function Home() {
  const session = await auth()
  const authed = isAuthed(session)

  return (
    <>
      <h1 id="title"><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>welcome to compsigh <code>cascade</code> — <br />
      a one-night coding riddle competition.</p>
      <p>april 12th, 2024 at 6:00pm</p>
      <Spacer size={16} />
      <h2>details</h2>
      <ul>
        <li>participants form teams of 1-4</li>
        <li>the prize for the winning team is $100</li>
        <li>teams work to answer a three-part riddle</li>
        <li>each part consists of an input and output</li>
        <li>teams have 30 minutes to complete each part</li>
        <li>complete the riddle in the shortest amount of time</li>
        <li>the team with the shortest overall completion time wins</li>
        <li>teams who don&apos;t complete a part in 30 minutes still move on</li>
      </ul>
      <Spacer size={32} />
      {
        authed
          ? <Link href="/event">go to event dashboard</Link>
          : <Button type="signIn" text="sign in" />
      }
    </>
  )
}
