import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ScheduleProvider } from '../contexts/ScheduleContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Course Scheduler',
  description: 'A responsive course scheduling application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScheduleProvider>
          <header className="bg-blue-600 text-white p-4">
            <h1 className="text-2xl font-bold">Course Scheduler</h1>
          </header>
          <main className="container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-gray-200 p-4 text-center">
            <p>&copy; 2024 Course Scheduler</p>
          </footer>
        </ScheduleProvider>
      </body>
    </html>
  )
}