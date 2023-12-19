import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs';

const fira = Fira_Sans({
  weight: ['400', '500', '700']
})

export const metadata: Metadata = {
  title: 'Interex',
  description: 'A social platform where communities of like-minded people share interests.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={fira.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
