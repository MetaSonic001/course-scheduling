'use client'

import { Button, CircularProgress } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSchedule } from '../../contexts/ScheduleContext'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { setSchedule } = useSchedule()
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    reader.onload = async (e) => {
      const pdfBuffer = e.target?.result
      try {
        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pdfBuffer }),
        })
        const data = await response.json()
        setSchedule(data.schedule)
        router.push('/schedule')
      } catch (error) {
        console.error('Error uploading PDF:', error)
      } finally {
        setLoading(false)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Upload Timetable</h1>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
    </div>
  )
}