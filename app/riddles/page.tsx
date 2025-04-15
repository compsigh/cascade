import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed } from "@/functions/user-management";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Riddles() {
  const session = await auth();
  const authed = isAuthed(session);
  if (!session || !authed)
    redirect("/");

  const user = session.user;
  if (!user || !user.email || !user.name)
    redirect("/");

  return (
    <div className="page">
      <h1>cascade</h1>
      <main>
        <ul>
          <li className="normalText hoverableText"><Link href="/riddles/1">Riddle 1</Link></li>
          <li className="normalText hoverableText"><Link href="/riddles/2">Riddle 2</Link></li>
          <li className="normalText hoverableText"><Link href="/riddles/3">Riddle 3</Link></li>
        </ul>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
