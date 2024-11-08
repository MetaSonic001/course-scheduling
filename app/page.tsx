import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Welcome to Course Scheduler</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/upload" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Timetable
        </Link>
        <Link href="/schedule" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          View Schedule
        </Link>
        <Link href="/course-scheduling" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Go to Course Scheduling
                </Link>
                <Link href="/generator" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Go to Course generator
                </Link>
      </div>
    </div>
  )
}