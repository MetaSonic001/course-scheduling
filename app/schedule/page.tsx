'use client'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useState } from 'react'
import Timetable from '../../components/Timetable'

// Mock data - replace with actual data from your backend
const mockSchedule = [
  { day: 'Monday', time: '9:00 AM', course: 'Math 101', room: 'Room 101', batch: 'A' },
  { day: 'Monday', time: '10:00 AM', course: 'Physics 101', room: 'Room 102', batch: 'B' },
  { day: 'Tuesday', time: '9:00 AM', course: 'Chemistry 101', room: 'Room 103', batch: 'C' },
  // ... more schedule items
]

export default function Schedule() {
  const [selectedBatch, setSelectedBatch] = useState('')

  const filteredSchedule = selectedBatch
    ? mockSchedule.filter(item => item.batch === selectedBatch)
    : mockSchedule

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">Course Schedule</h1>
      
      <FormControl className="mb-4">
        <InputLabel>Select Batch</InputLabel>
        <Select
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value as string)}
          className="min-w-[200px]"
        >
          <MenuItem value="">All Batches</MenuItem>
          <MenuItem value="A">Batch A</MenuItem>
          <MenuItem value="B">Batch B</MenuItem>
          <MenuItem value="C">Batch C</MenuItem>
        </Select>
      </FormControl>

      <Timetable schedule={filteredSchedule} />
    </div>
  )
}