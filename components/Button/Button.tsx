'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text, inviteId }:
  {
    type: 'signIn' | 'stripe' | 'accept-invite' | 'decline-invite',
    text: string,
    inviteId?: string
  }
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
      <form action='/api/stripe' method='POST'>
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  if (type === 'accept-invite')
    return (
      <form action='/api/db/invites' method='POST'>
        <input type='hidden' name='id' value={inviteId} />
        <input type='hidden' name='action' value='accept' />
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  if (type === 'decline-invite')
    return (
      <form action='/api/db/invites' method='POST'>
        <input type='hidden' name='id' value={inviteId} />
        <input type='hidden' name='action' value='decline' />
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  return <></>
}
