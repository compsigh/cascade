import { FooterMenu } from "@/components/FooterMenu";

export default function Details() {
  return (
    <div className="page">
      <h1>cascade</h1>
      <main>
        <ul className="normalText">
          <li className="selectedText">participants form teams of 1-4</li>
          <li>teams work to answer the riddles</li>
          <li>the prize for the winning team is $100</li>
          <li>the first team to complete the riddles wins</li>
        </ul>
      </main>

      <FooterMenu />
    </div>
  );
}
