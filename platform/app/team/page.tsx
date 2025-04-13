import styles from "./page.module.css";
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
      <main>
        <h1>cascade</h1>
        <h2 className={styles.normalText}>your team:</h2>
        <ul className={styles.normalText}>
          <li>nishil</li>
          <li>gursh</li>
          <li>edward</li>
          <li>quinn</li>
        </ul>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
