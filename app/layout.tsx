import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"

const pally = localFont({
  src: '/fonts/Pally-Variable.woff2',
  variable: '--font-pally',
});

let metadataBase: URL;
if (process.env.VERCEL_URL)
  metadataBase = new URL('https://cascade.compsigh.club');
else
  metadataBase = new URL(`http://localhost:${process.env.PORT || 3000}`);

export const metadata: Metadata = {
  metadataBase,
  title: 'compsigh cascade',
  description: 'A one-night coding riddle competition for the compsigh community on April 25th 2025 at 6pm',
  openGraph: {
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pally.variable}>
      <body>{children}</body>
    </html>
  );
}
