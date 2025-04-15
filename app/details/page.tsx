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
        <ul className="normalText">
          <li className="hoverableText">participants form teams of 1-4</li>
          <li className="hoverableText">teams work to answer the riddles</li>
          <li className="hoverableText">the prize for the winning team is $100</li>
          <li className="hoverableText">the first team to complete the riddles wins</li>
        </ul>
      </main>

      <FooterMenu signedIn={authed} />
    </div>
  );
}
