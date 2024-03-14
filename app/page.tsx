import { Spacer } from '@/components/Spacer'
import { auth } from '@/auth'
import { checkAuth } from '@/functions/user-management'
import Link from 'next/link'

export default async function Home() {
  const session = await auth()
  const authed = checkAuth(session)

  return (
    <>
      <h1><code className="blackCode">cascade</code></h1>
      <Spacer size={32} />
      <p>welcome to compsigh <code>cascade</code> — <br />
      a one-night coding riddle competition.</p>
      <Spacer size={16} />
      <h2>details</h2>
      <ul>
        <li>each participant deposits $10</li>
        <li>the prize for the winning team is $100</li>
        <li>participants form teams of 1-4 (solo is ok)</li>
        <li>teams work to answer a three-part riddle</li>
        <li>teams have 30 minutes to complete each part</li>
        <li>each part consists of an input and output unique to your team</li>
        <li>complete the riddle, matching your unique input to the output, in the shortest amount of time</li>
        <li>the team with the shortest total time-to-completion across the three parts wins</li>
        <li>teams who do not complete a part within 30 minutes will receive the output needed to move on to the next part</li>
      </ul>
      <Spacer size={32} />
      <ul>
        <li>
          {
            authed
              ? <Link href="/event">go to event dashboard</Link>
              : <Link href="/api/auth/signin">sign in</Link>
          }
        </li>
      </ul>
    </>
  )
}