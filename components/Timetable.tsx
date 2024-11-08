import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'

interface TimetableProps {
  schedule: Array<{
    day: string
    time: string
    course: string
    room: string
  }>
}

const Timetable: React.FC<TimetableProps> = ({ schedule }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

  return (
    <TableContainer component={Paper} className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            {days.map(day => (
              <TableCell key={day}>{day}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {times.map(time => (
            <TableRow key={time}>
              <TableCell>{time}</TableCell>
              {days.map(day => {
                const scheduleItem = schedule.find(item => item.day === day && item.time === time)
                return (
                  <TableCell key={`${day}-${time}`}>
                    {scheduleItem ? (
                      <div>
                        <div>{scheduleItem.course}</div>
                        <div className="text-sm text-gray-500">{scheduleItem.room}</div>
                      </div>
                    ) : null}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default Timetable