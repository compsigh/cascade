'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text }:
  { type: 'signIn' | 'submit', text: string }
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

  if (type === 'submit')
    return (
      <button type="submit" className={styles.button}>
        {text}
      </button>
    )

  return <></>
}
