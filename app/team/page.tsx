import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed } from "@/functions/user-management";
import { redirect } from "next/navigation";
import { getParticipantByEmail, getTeamById } from "@/functions/db";
import { TeamList } from "@/components/TeamList";

export default async function Team() {
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
        <h2 className="normalText">your team:</h2>
        <TeamList user={user} />
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
