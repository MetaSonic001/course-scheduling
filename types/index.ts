export interface Schedule {
    [room: string]: {
      [time: string]: string;
    };
  }
  
  export interface Conflict {
    course: string;
    preferences: {
      preference: string;
      reason: string;
    }[];
  }
  
  export interface ErrorMessage {
    message: string;
  }
  
  export interface Room {
    number: string;
    capacity: number;
  }
  
  export interface Course {
    number: string;
    enrollment: number;
    preferences: string[];
  }
  
  export interface InputData {
    rooms: Room[];
    courses: string[];
    times: string[];
    courseDetails: Course[];
  }


  export interface Room {
    number: string;
    capacity: number;
  }
  
  export interface Timetable {
    [room: string]: {
      [time: string]: string;
    };
  }