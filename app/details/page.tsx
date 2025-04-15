import { FooterMenu } from "@/components/FooterMenu";
import { auth } from "@/auth";
import { isAuthed } from "@/functions/user-management";

export default async function Details() {
  const session = await auth();
  const authed = isAuthed(session);

  return (
    <div className="page">
      <h1>cascade</h1>
      <main>
        <ul>
          <li className="normalText hoverableText">participants form teams of 1-4</li>
          <li className="normalText hoverableText">teams work to answer the riddles</li>
          <li className="normalText hoverableText">the prize for the winning team is $100</li>
          <li className="normalText hoverableText">the first team to complete the riddles wins</li>
        </ul>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
