import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from './providers';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SSEProvider } from '@/lib/sse-context';
import { SWRProvider } from '@/lib/swr-config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WEAVE - Living Memory Messaging',
  description: 'Everyday chat that becomes a structured, searchable knowledge base',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <SWRProvider>
              <SSEProvider>
                {children}
              </SSEProvider>
            </SWRProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}



