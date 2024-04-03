'use client'

import { signIn } from 'next-auth/react'
import styles from './Button.module.css'

export function Button(
  { type, text, inviteId, fromEmail, toEmail }:
  {
    type: 'signIn' | 'stripe' | 'send-invite' | 'accept-invite' | 'decline-invite',
    text: string,
    inviteId?: string,
    fromEmail?: string,
    toEmail?: string
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

  if (type === 'send-invite')
    return (
      <form action='/api/db/invite' method='POST'>
        <input type='hidden' name='from' value={fromEmail} />
        <input type='hidden' name='to' value={toEmail} />
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  if (type === 'accept-invite')
    return (
      <form action='/api/db/invite' method='PUT'>
        <input type='hidden' name='id' value={inviteId} />
        <input type='hidden' name='action' value='accept' />
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  if (type === 'decline-invite')
    return (
      <form action='/api/db/invite' method='PUT'>
        <input type='hidden' name='id' value={inviteId} />
        <input type='hidden' name='action' value='decline' />
        <button type='submit' className={styles.button}>
          {text}
        </button>
      </form>
    )

  return <></>
}
