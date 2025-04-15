import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed } from "@/functions/user-management";
import { redirect } from "next/navigation";

export default async function Team() {
  const session = await auth();
  const authed = isAuthed(session);
  if (!session || !authed)
    redirect("/");

  const user = session.user;
  if (!user || !user.email || !user.name)
    redirect("/");

  // TODO: get team members from database, not hardcoded

  return (
    <div className="page">
      <h1>cascade</h1>
      <main>
        <h2 className="normalText">your team:</h2>
        <ul className="normalText">
          <li className="hoverableText">nishil</li>
          <li className="hoverableText">gursh</li>
          <li className="hoverableText">edward</li>
          <li className="hoverableText">quinn</li>
        </ul>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
