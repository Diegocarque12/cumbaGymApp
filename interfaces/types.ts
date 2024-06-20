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
  description: string;
}

export interface UserRoutine {
  id: number;
  userId: number;
  routineId: number;
}

export interface ExerciseSet {
  id: number;
  routineId: number;
  exerciseId: number;
  setnumber: number;
  weight: number;
  repetitions: number;
}

export interface Exercise {
    id: number;
    name: string;
    description: string;
    category: string;
    target_muscle: string;
    equipment: string;
    difficulty: string;
    instructions: string;
    video_url: string;
    image_url: string;
    created_at: string;
    updated_at: string;
}