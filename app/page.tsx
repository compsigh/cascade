import styles from "./page.module.css";
import { FooterMenu } from "@/components/FooterMenu";

export default function Home() {
  return (
    <div className="page">
      <main>
        <h1 className={styles.title}>cascade</h1>
        <p className={styles.subtitle}>a one-night coding riddle competition</p>
        <p className={styles.subtitle}>friday, april 25th, 6pm @ the hive</p>
      </main>

      <FooterMenu />
    </div>
  );
}
