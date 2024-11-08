'use client'
import { Box, Button, CircularProgress, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import ConflictReport from '../../components/ConflictReport';
import ErrorMessages from '../../components/ErrorMessages';
import FileUpload from '../../components/FileUpload';
import ScheduleDisplay from '../../components/ScheduleDisplay';
import { Conflict, ErrorMessage, Schedule } from '../../types';

export default function CourseScheduling() {
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (file1: File, file2: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    try {
      const response = await fetch('/api/process-schedule', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process schedule');
      }

      const result = await response.json();
      setSchedule(result.schedule);
      setConflicts(result.conflicts);
      setErrors(result.errors);
    } catch (error) {
      console.error('Error processing schedule:', error);
      setErrors([{ message: 'An error occurred while processing the schedule.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Scheduling System
        </Typography>
        <FileUpload onUpload={handleFileUpload} />
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        {schedule && <ScheduleDisplay schedule={schedule} />}
        {conflicts.length > 0 && <ConflictReport conflicts={conflicts} />}
        {errors.length > 0 && <ErrorMessages errors={errors} />}
        <Box mt={2}>
          <Link href="/">
            <Button variant="contained" color="secondary">
              Back to Home
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}