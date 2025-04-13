import { FooterMenu } from "@/components/FooterMenu";
import styles from "./page.module.css";
import { auth } from "@/auth";
import { isAuthed, isOrganizer } from "@/functions/user-management";

export default async function Home() {
  const session = await auth();
  const authed = isAuthed(session);
  const organizer = isOrganizer(session);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
