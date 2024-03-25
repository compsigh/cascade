'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text }:
  { type: 'signIn' | 'stripe', text: string }
) {
  if (type === 'signIn')
    return (
      <button
        onClick={() => signIn('google', { callbackUrl: '/event' })}
        className={styles.button}
      >
        {text}
      </button>
    )

  if (type === 'stripe')
    return (
      <button
        onClick={() => fetch('/api/stripe', { method: 'POST' })}
        className={styles.button}
      >
        {text}
      </button>
    )

  return <></>
}
