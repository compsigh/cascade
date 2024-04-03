'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text }:
  { type: 'signIn' | 'stripe' | 'submit', text: string }
) {
  if (type === 'signIn')
    return (
      <button
        onClick={() => signIn("google", { callbackUrl: "/event" })}
        className={styles.button}
      >
        {text}
      </button>
    )

  if (type === 'stripe')
    return (
      <form action="/api/stripe" method="POST">
        <button type="submit" className={styles.button}>
          {text}
        </button>
      </form>
    )

  if (type === 'submit')
    return (
      <button type="submit" className={styles.button}>
        {text}
      </button>
    )

  return <></>
}
