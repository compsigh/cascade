"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getLinkItem(href: string, currPath: string) {
  const style = href === currPath ? styles.selected : "";
  return (
    <Link href={href} className={style}>
      {href === "/" ? "cascade" : href}
    </Link>
  );
}

export function FooterMenu() {
  const currentPath = usePathname();

  return (
    <nav className={styles.footer}>
      {getLinkItem("/", currentPath)}
      {getLinkItem("details", currentPath)}
      {getLinkItem("sign-in", currentPath)}
    </nav>
  );
}
