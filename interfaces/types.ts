export interface User {
  id: number;
  nationalId: string;
  name: string;
  lastName: string;
  age: number;
  goal?: string;
  startDate: Date;
  gender: string;
}

export interface Routine {
  id: number;
  name: string;
}

export interface UserRoutine {
  id: number;
  userId: number;
  routineId: number;
}

export interface ExerciseSet {
  id: number;
  routineId: number;
  machinename: string;
  setnumber: number;
  weight: number;
  repetitions: number;
}
