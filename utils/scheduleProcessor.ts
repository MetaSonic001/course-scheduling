import { promises as fs } from 'fs';
import { IncomingMessage } from 'http';
import { Conflict, Course, ErrorMessage, Room, Schedule } from '../types';

export interface InputData {
  rooms: Room[];
  courses: string[];
  times: string[];
  courseDetails: Course[];
  errors: ErrorMessage[];
}

export async function processSchedule(req: IncomingMessage): Promise<{ schedule: Schedule; conflicts: Conflict[]; errors: ErrorMessage[] }> {
  const data = await parseMultipartForm(req);
  const file1Content = await fs.readFile(data.file1.path, 'utf-8');
  const file2Content = await fs.readFile(data.file2.path, 'utf-8');

  const inputData = parseInputFiles(file1Content, file2Content);
  const { schedule, conflicts, errors } = generateSchedule(inputData);

  // Clean up temporary files
  await fs.unlink(data.file1.path);
  await fs.unlink(data.file2.path);

  return { schedule, conflicts, errors };
}

async function parseMultipartForm(req: IncomingMessage): Promise<{ file1: { path: string }, file2: { path: string } }> {
  // TODO: Implement proper multipart form parsing
  // This is a placeholder implementation
  return {
    file1: { path: '/tmp/file1.txt' },
    file2: { path: '/tmp/file2.txt' },
  };
}

function parseInputFiles(file1Content: string, file2Content: string): InputData {
  const errors: ErrorMessage[] = [];
  let rooms: Room[] = [];
  let courses: string[] = [];
  let times: string[] = [];
  const courseDetails: Course[] = [];

  // Parse file 1
  const file1Lines = file1Content.split('\n');
  let section = '';
  for (const line of file1Lines) {
    if (line.trim() === 'rooms') {
      section = 'rooms';
    } else if (line.trim() === 'courses') {
      section = 'courses';
    } else if (line.trim() === 'times') {
      section = 'times';
    } else if (line.trim() === ';') {
      section = '';
    } else if (section === 'rooms') {
      const [roomNumber, capacity] = line.split(':').map(s => s.trim());
      if (roomNumber && capacity) {
        const capacityNum = parseInt(capacity);
        if (isNaN(capacityNum) || capacityNum < 10 || capacityNum > 300) {
          errors.push({ message: `Invalid room capacity: ${capacity}` });
        } else {
          rooms.push({ number: roomNumber, capacity: capacityNum });
        }
      }
    } else if (section === 'courses') {
      courses = courses.concat(line.split(',').map(s => s.trim()));
    } else if (section === 'times') {
      times = times.concat(line.split(',').map(s => s.trim()));
    }
  }

  // Parse file 2
  const file2Lines = file2Content.split('\n');
  for (const line of file2Lines) {
    const [courseNumber, enrollment, ...preferences] = line.split(/\s+/);
    if (courseNumber && enrollment) {
      const enrollmentNum = parseInt(enrollment);
      if (isNaN(enrollmentNum) || enrollmentNum < 3 || enrollmentNum > 250) {
        errors.push({ message: `Invalid enrollment for course ${courseNumber}: ${enrollment}` });
      } else {
        courseDetails.push({
          number: courseNumber,
          enrollment: enrollmentNum,
          preferences: preferences.filter(p => p !== ','),
        });
      }
    }
  }

  // Validate input
  if (rooms.length > 20) {
    errors.push({ message: 'Too many rooms (max 20)' });
    rooms = rooms.slice(0, 20);
  }
  if (courses.length > 30) {
    errors.push({ message: 'Too many courses (max 30)' });
    courses = courses.slice(0, 30);
  }
  if (times.length > 15) {
    errors.push({ message: 'Too many lecture times (max 15)' });
    times = times.slice(0, 15);
  }

  return { rooms, courses, times, courseDetails, errors };
}

function generateSchedule(inputData: InputData): { schedule: Schedule; conflicts: Conflict[]; errors: ErrorMessage[] } {
  const { rooms, courses, times, courseDetails, errors } = inputData;
  const schedule: Schedule = {};
  const conflicts: Conflict[] = [];

  // Initialize empty schedule
  for (const room of rooms) {
    schedule[room.number] = {};
    for (const time of times) {
      schedule[room.number][time] = '';
    }
  }

  // Sort courses: graduate courses first, then by order in input file
  const sortedCourses = courseDetails.sort((a, b) => {
    const aGrad = parseInt(a.number.slice(2)) >= 600;
    const bGrad = parseInt(b.number.slice(2)) >= 600;
    if (aGrad && !bGrad) return -1;
    if (!aGrad && bGrad) return 1;
    return courses.indexOf(a.number) - courses.indexOf(b.number);
  });

  for (const course of sortedCourses) {
    let scheduled = false;
    const conflict: Conflict = { course: course.number, preferences: [] };

    for (const preference of course.preferences) {
      if (!times.includes(preference)) {
        conflict.preferences.push({ preference, reason: 'Invalid time preference' });
        continue;
      }

      const availableRooms = rooms.filter(room => room.capacity >= course.enrollment);
      if (availableRooms.length === 0) {
        conflict.preferences.push({ preference, reason: 'No room with sufficient capacity' });
        continue;
      }

      // Check if any course (graduate or undergraduate) is already scheduled at this time
      const courseConflict = Object.values(schedule).some(r => r[preference] !== '');
      if (courseConflict) {
        conflict.preferences.push({ preference, reason: 'Time slot already occupied' });
        continue;
      }

      // Check for graduate course conflicts
      const isGraduateCourse = parseInt(course.number.slice(2)) >= 600;
      const gradCourseConflict = Object.values(schedule).some(r => 
        r[preference] !== '' && parseInt(r[preference].slice(2)) >= 600
      );
      if (isGraduateCourse && gradCourseConflict) {
        conflict.preferences.push({ preference, reason: 'Conflict with another graduate course' });
        continue;
      }

      // Schedule the course
      for (const room of availableRooms) {
        if (schedule[room.number][preference] === '') {
          schedule[room.number][preference] = course.number;
          scheduled = true;
          break;
        }
      }

      if (scheduled) break;
    }

    if (!scheduled) {
      if (conflict.preferences.length > 0) {
        conflicts.push(conflict);
      } else {
        conflicts.push({ course: course.number, preferences: [{ preference: 'Any', reason: 'Unable to schedule' }] });
      }
    }
  }

  return { schedule, conflicts, errors };
}