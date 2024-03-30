import React from 'react'

import Sidebar from '@/components/bars/Sidebar'
import Navbar from '@/components/bars/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Focus Meet',
  description: 'Video calling App',
  icons: {
    icon: '/icons/logo.svg'
  }
}

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  )
}

export default HomeLayout
