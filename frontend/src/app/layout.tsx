import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Provider from '@/lib/sessionContext';
import { fira } from '@/fonts';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Interex',
  description: 'A social platform where communities of like-minded people share interests.',
  icons: {
    icon: '../../assets/logo2.svg'
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={`${fira.className} antialiased text-white box-border`}>
				<NextTopLoader showSpinner={false} />
        <Provider session={session}>
          <Navbar />
          <div className='min-h-screen mt-14 bg-gradient-to-b from-interex-bg-black to-interex-bg-blue to-15%'>
            {children}
          </div>
        </Provider>
      </body>
    </html>
  )
}
