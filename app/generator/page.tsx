'use client'
import { Box, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import FileUpload from '../../components/FileUpload';
import TimetableDisplay from '../../components/TimeTableDisplay';
import { Room, Timetable } from '../../types';
import { generateTimetable, parseInputText } from '../../utils/timetableGenerator';

export default function TimetableGenerator() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);
  const [timetable, setTimetable] = useState<Timetable | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const { rooms, courses, times } = parseInputText(text);
      setRooms(rooms);
      setCourses(courses);
      setTimes(times);
      const generatedTimetable = generateTimetable(rooms, courses, times);
      setTimetable(generatedTimetable);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timetable Generator
        </Typography>
        <FileUpload onUpload={handleFileUpload} accept=".txt" />
        {error && (
          <Paper className="my-4 p-4 bg-red-100">
            <Typography color="error">{error}</Typography>
          </Paper>
        )}
        {timetable && (
          <TimetableDisplay timetable={timetable} rooms={rooms} times={times} />
        )}
      </Box>
    </Container>
  );
}