'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text }:
  { type: 'signIn', text: string }
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
  return <></>
}
