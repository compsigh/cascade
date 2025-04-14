'use client'

import { usePathname } from 'next/navigation'

import styles from './Breadcrumbs.module.css'
import Link from 'next/link'

function Crumb(
  { href, children }:
  { href: string, children: React.ReactNode }
) {
  return (
    <li>
      <Link href={href}>
        {children}
      </Link>
    </li>
  )
}

export function Breadcrumbs() {
  const path = usePathname()
  const crumbs = path.split('/').filter(Boolean)
  crumbs.pop()

  return (
    <nav
      id={styles.breadcrumbs}
      aria-label="Breadcrumb"
    >
      <ol>
        <Crumb key="/" href="/">
          <h1 id="title"><code className="invert">cascade</code></h1>
        </Crumb>
        {crumbs.map((text, i) => (
          <Crumb
            key={i}
            href={`/${crumbs.slice(0, i + 1).join('/')}`}
          >
            {text}
          </Crumb>
        ))}
      </ol>
    </nav>
  )
}
