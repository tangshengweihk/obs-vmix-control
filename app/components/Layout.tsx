import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-bold">OBS/vMix Control Panel</h1>
      </header>
      <main className="container mx-auto py-6">{children}</main>
    </div>
  )
}

