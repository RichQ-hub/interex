import type { Metadata } from 'next'
import { Fira_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar';

const fira = Fira_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Interex',
  description: 'A social platform where communities of like-minded people share interests.',
  icons: {
    icon: '../../assets/logo2.svg'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${fira.className} antialiased text-white`}>
        <Navbar />
        <div className='min-h-screen mt-14 bg-gradient-to-b from-interex-bg-black to-interex-bg-blue to-15%'>
          {children}
        </div>
      </body>
    </html>
  )
}
