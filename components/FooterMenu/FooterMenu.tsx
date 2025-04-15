"use client";

import styles from "./FooterMenu.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getLinkItem(text: string, href: string, currPath: string) {
  const style = href === currPath ? "selectedText" : "";
  return (
    <Link href={href} className={style}>
      {text}
    </Link>
  );
}

export function FooterMenu() {
  const currentPath = usePathname();

  return (
    <nav className={styles.footer}>
      {getLinkItem("cascade", "/", currentPath)}
      {getLinkItem("details", "/details", currentPath)}
    </nav>
  );
}
