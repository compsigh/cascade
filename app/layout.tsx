import type { Metadata } from 'next'
import localFont from 'next/font/local'
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
  description: 'compsigh cascade — a one-night coding riddle competition'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
