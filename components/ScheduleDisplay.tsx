import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Schedule } from '../types';

interface ScheduleDisplayProps {
  schedule: Schedule;
}

export default function ScheduleDisplay({ schedule }: ScheduleDisplayProps) {
  const rooms = Object.keys(schedule);
  const times = Object.keys(schedule[rooms[0]]);

  return (
    <TableContainer component={Paper} className="my-4">
      <Typography variant="h6" gutterBottom className="p-4">Course Schedule</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Room</TableCell>
            {times.map((time) => (
              <TableCell key={time}>{time}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room}>
              <TableCell component="th" scope="row">
                {room}
              </TableCell>
              {times.map((time) => (
                <TableCell key={`${room}-${time}`}>
                  {schedule[room][time] || ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}