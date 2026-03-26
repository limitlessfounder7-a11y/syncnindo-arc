import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syncnindo ARC System',
  description: 'Sistem Manajemen Operasional Rental Mobil',
  manifest: '/manifest.json', // Link ke PWA
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
