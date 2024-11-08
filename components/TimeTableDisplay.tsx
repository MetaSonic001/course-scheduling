import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Room, Timetable } from '../types';

interface TimetableDisplayProps {
  timetable: Timetable;
  rooms: Room[];
  times: string[];
}

export default function TimetableDisplay({ timetable, rooms, times }: TimetableDisplayProps) {
  return (
    <TableContainer component={Paper} className="my-4">
      <Typography variant="h6" gutterBottom className="p-4">Generated Timetable</Typography>
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
            <TableRow key={room.number}>
              <TableCell component="th" scope="row">
                {room.number} (Cap: {room.capacity})
              </TableCell>
              {times.map((time) => (
                <TableCell key={`${room.number}-${time}`}>
                  {timetable[room.number][time] || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}