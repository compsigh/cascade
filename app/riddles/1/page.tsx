import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed } from "@/functions/user-management";
import styles from "../page.module.css";

import { redirect } from "next/navigation";

export default async function Riddle1() {
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
      <main style={{ textAlign: "left" }}>
        <h2>Riddle 1</h2>

        <p className={`normalText ${styles.subtitleText}`}>description</p>

        <p className={`normalText ${styles.riddleText}`}>You are a USF student, tired of walking from classroom to classroom promoting your club. You have been given a list of classroom locations in the form of <code>[(x1, y1), (x2, y2), ..., (xi, yi)]</code>. You've decided it'd be best to visit just half of the classrooms; specifically the half that takes the shortest path to visit. For this half of the classrooms, sum all of the <code>x</code> and <code>y</code> values together for your solution.</p>
        <p className={`normalText ${styles.riddleText}`}><b>Note:</b> The distance between two points <code>(x1, y1)</code> and <code>(x2, y2)</code> can be calculated using the Euclidean distance formula:</p>
        <p className={`normalText ${styles.riddleText}`} style={{ textAlign: "center" }}>
          <code>d = √((x2 - x1)² + (y2 - y1)²)</code>
        </p>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
