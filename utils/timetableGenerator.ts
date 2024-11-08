import { Room, Timetable } from '../types';

export function parseInputText(text: string): { rooms: Room[], courses: string[], times: string[] } {
  const lines = text.split('\n');
  let currentSection = '';
  const rooms: Room[] = [];
  let courses: string[] = [];
  let times: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === 'rooms') {
      currentSection = 'rooms';
    } else if (trimmedLine === 'courses') {
      currentSection = 'courses';
    } else if (trimmedLine === 'times') {
      currentSection = 'times';
    } else if (trimmedLine === ';') {
      currentSection = '';
    } else if (currentSection === 'rooms') {
      const [roomNumber, capacity] = trimmedLine.split(':').map(s => s.trim());
      if (roomNumber && capacity) {
        rooms.push({ number: roomNumber, capacity: parseInt(capacity) });
      }
    } else if (currentSection === 'courses') {
      courses = courses.concat(trimmedLine.split(',').map(s => s.trim()));
    } else if (currentSection === 'times') {
      times = times.concat(trimmedLine.split(',').map(s => s.trim()));
    }
  }

  return { rooms, courses, times };
}

export function generateTimetable(rooms: Room[], courses: string[], times: string[]): Timetable {
  const timetable: Timetable = {};

  for (const room of rooms) {
    timetable[room.number] = {};
    for (const time of times) {
      timetable[room.number][time] = '';
    }
  }

  // Simple algorithm to assign courses to rooms and times
  let courseIndex = 0;
  for (const room of rooms) {
    for (const time of times) {
      if (courseIndex < courses.length) {
        timetable[room.number][time] = courses[courseIndex];
        courseIndex++;
      } else {
        break;
      }
    }
    if (courseIndex >= courses.length) break;
  }

  return timetable;
}