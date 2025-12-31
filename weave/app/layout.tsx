import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WEAVE - Living Memory Messaging',
  description: 'Everyday chat that becomes a structured, searchable knowledge base',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

