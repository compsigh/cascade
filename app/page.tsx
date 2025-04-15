import styles from "./page.module.css";
import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed, isOrganizer } from "@/functions/user-management";

export default async function Home() {
  const session = await auth();
  const authed = isAuthed(session);
  const organizer = isOrganizer(session);

  return (
    <div className="page">
      <main>
        <h1 className={styles.title}>cascade</h1>
        <p className={styles.subtitle}>a one-night coding riddle competition</p>
        <p className={styles.subtitle}>friday, april 25th, 6pm @ the hive</p>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
