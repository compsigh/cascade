import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ViewTransitions } from 'next-view-transitions'

import { Spacer } from '@/components/Spacer'
import { Breadcrumbs } from '@/components/Breadcrumbs'

import './globals.css'

const GeistMono = localFont({
  src: '/fonts/GeistMonoVariableVF.woff2',
  variable: '--font-geist-mono'
})

let metadataBase: URL
if (process.env.VERCEL_URL) metadataBase = new URL('https://cascade.compsigh.club')
else metadataBase = new URL(`http://localhost:${process.env.PORT || 3000}`)

export const metadata: Metadata = {
  metadataBase,
  title: 'compsigh cascade',
  description: 'A one-night coding riddle competition for the compsigh community on October 18th 2024 at 6pm',
  openGraph: {
    images: [ '/og-image.png' ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${GeistMono.variable}`}
      >
        <body>
          <Breadcrumbs />
          <Spacer size={32} />
          {children}
          <Spacer size={"20vh"} />
        </body>
      </html>
    </ViewTransitions>
  )
}
