import { FooterMenu } from "@/components/FooterMenu";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
      </main>

      <FooterMenu />
    </div>
  );
}
