"use client";

import styles from "./page.module.css";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getSignInItem(signedIn: boolean) {
  return (
    signedIn ?
      <Link href="/" onClick={() => signOut()}>sign out</Link>
      : <Link href="/" onClick={() => signIn('google', { callbackUrl: '/' })}>sign in</Link>
  );
}

function getLinkItem(text: string, href: string, currPath: string) {
  const style = href === currPath ? styles.selected : "";
  return (
    <Link href={href} className={style}>
      {text}
    </Link>
  );
}

export function FooterMenu(
  { signedIn }: { signedIn: boolean }
) {
  const currentPath = usePathname();

  return (
    <nav className={styles.footer}>
      {getLinkItem("cascade", "/", currentPath)}
      {getLinkItem("details", "/details", currentPath)}
      {signedIn && getLinkItem("team", "/team", currentPath)}
      {getSignInItem(signedIn)}
    </nav>
  );
}
