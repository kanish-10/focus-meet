import React from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Focus Meet',
  description: 'Video calling App',
  icons: {
    icon: '/icons/logo.svg'
  }
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  )
}

export default RootLayout
