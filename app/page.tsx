import { auth } from "@/auth"
import { get } from "@vercel/edge-config"
import { isAuthed, isOrganizer } from "@/functions/user-management"

import Link from "next/link"
import { Spacer } from "@/components/Spacer"
import { Button } from "@/components/Button"
import { TextStream } from "@/components/TextStream"

export default async function Home() {
  const session = await auth()
  const authed = isAuthed(session)
  const organizer = isOrganizer(session)
  const maxTeamSize = await get<number>("maxTeamSize")

  return (
    <>
      <p>
        welcome to compsigh <code>cascade</code> — <br />a one-night coding
        riddle competition.
      </p>
      <p>april 25th, 2025 at 6:00pm</p>
      <Spacer size={16} />
      <h2>
        <TextStream duration={0.6} text="details" />
      </h2>
      <ul>
        <li>
          <TextStream
            duration={1}
            text={`participants form teams of 1–${maxTeamSize !== null ? maxTeamSize : "N/A"}`}
          />
        </li>
        <li>
          <TextStream duration={1.2} text="teams work to answer the riddle" />
        </li>
        <li>
          <TextStream
            duration={1.4}
            text="the prize for the winning team is $100"
          />
        </li>
        <li>
          <TextStream
            duration={1.8}
            text="the team with the shortest completion time wins"
          />
        </li>
      </ul>
      <Spacer size={32} />
      {authed ? (
        <Link href="/event">
          <TextStream duration={0.8} text="go to event dashboard" />
        </Link>
      ) : (
        <Button type="signIn">
          <TextStream duration={0.8} text="sign in" />
        </Button>
      )}
      {organizer && (
        <>
          <Spacer size={8} />
          <Link href="/admin">
            <TextStream duration={0.8} text="go to admin panel" />
          </Link>
        </>
      )}
    </>
  )
}
