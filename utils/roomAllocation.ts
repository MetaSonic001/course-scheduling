interface Room {
    number: string;
    capacity: number;
  }
  
  interface Course {
    name: string;
    expectedEnrollment: number;
  }
  
  export function allocateRooms(courses: Course[], rooms: Room[]): Map<string, string> {
    const sortedRooms = rooms.sort((a, b) => a.capacity - b.capacity);
    const allocation = new Map<string, string>();
  
    for (const course of courses) {
      const suitableRoom = sortedRooms.find(room => room.capacity >= course.expectedEnrollment);
      if (suitableRoom) {
        allocation.set(course.name, suitableRoom.number);
      } else {
        console.warn(`No suitable room found for ${course.name}`);
      }
    }
  
    return allocation;
  }