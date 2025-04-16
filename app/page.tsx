import styles from "./page.module.css";
import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed, isOrganizer } from "@/functions/user-management";
import { createParticipant, getParticipantByEmail } from "@/functions/db";

function createParticipantIfNotExists(email: string, name: string) {
  getParticipantByEmail(email).then((participant) => {
    console.log("got a participant:", participant);
    if (!participant) {
      console.log("creating participant");
      createParticipant(name, email).catch((err) => {
        console.error("Error creating participant:", err);
      });
    }
  }).catch((err) => {
    console.error("Error fetching participant:", err);
  });
}

export default async function Home() {
  const session = await auth();
  const authed = isAuthed(session);
  // const organizer = isOrganizer(session);

  if (authed) {
    console.log("authed");
    const user = session!.user!;
    const name = user.name!;
    const email = user.email!;
    createParticipantIfNotExists(email, name);
  } else {
    console.log("not authed");
  }

  return (
    <div className="page">
      <main>
        <h1 className={styles.title}>cascade</h1>
        <p className={`normalText ${styles.subtitle}`}>a one-night coding riddle competition</p>
        <p className={`normalText ${styles.subtitle}`}>friday, april 25th, 6pm @ the hive</p>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
