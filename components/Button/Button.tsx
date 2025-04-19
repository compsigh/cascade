"use client"

import { signIn } from "next-auth/react"
import styles from "./Button.module.css"

export function Button({
  type,
  children,
  disabled = false
}: {
  type: "signIn" | "submit"
  children: React.ReactNode
  disabled?: boolean
}) {
  if (type === "signIn") {
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/event" })}
        className={styles.button}
      >
        {children}
      </button>
    )
  }

  if (type === "submit") {
    return (
      <button type="submit" className={styles.button} disabled={disabled}>
        {children}
      </button>
    )
  }

  return <></>
}
