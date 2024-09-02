export interface User {
  id?: number;
  national_id: string;
  name: string;
  last_name: string;
  age: number;
  goal?: string;
  start_date: Date;
  gender: string;
  is_active: boolean;
  deleted_at?: Date;
  role: "user" | "coach" | "admin";
}

export interface Routine {
  id: number;
  name: string;
  description: string;
}

export interface UserRoutine {
  id: number;
  routine_id: number;
  user_id: number;
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
}

export interface UserMeasurement {
  id: number;
  user_id: number;
  left_arm: number;
  right_arm: number;
  upper_waist: number;
  lower_waist: number;
  left_thigh: number;
  right_thigh: number;
  measurement_date: string;
  weight: number;
  height: number;
}

export interface RoutineExercise {
  id: number;
  weight_type_id: number;
  routine_id: number;
  exercise_id: number;
}

export interface RoutineExerciseSet {
  id?: number;
  routine_exercise_id: number;
  set_number: number;
  suggested_weight: number;
  suggested_repetitions: number;
}

export interface WeightTypes {
  id: number;
  name: string;
}

export interface WorkoutHistory {
  id: number;
  user_id: number;
  routine_exercise_id: number;
  weight: number;
  repetitions: number;
  set_number: number;
  date_completed: Date;
}

export interface routineLog {
  id: number;
  user_id: number;
  routine_id: number;
  completed_at: Date;
}
