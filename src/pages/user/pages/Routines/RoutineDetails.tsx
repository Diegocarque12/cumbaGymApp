import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import { Exercise, Routine, RoutineExercise, RoutineExerciseSet } from "../../../../interfaces/types";
import { toast } from "react-toastify";
import ErrorBoundary from "@/components/ErrorBoundary";
import ExerciseSetList from "../components/routine/ExerciseSetList";

export default function RoutineDetails() {
  const { routine_id } = useParams<{ routine_id: string }>();
  const currentRoutineId = Number(routine_id);
  const [routine, setRoutine] = useState<Routine>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routineExercise, setRoutineExercise] = useState<RoutineExercise[]>([]);
  const [routineExerciseSet, setRoutineExerciseSet] = useState<RoutineExerciseSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("id", currentRoutineId)
        .single();
      if (data) {
        setRoutine(data);
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err as Error);
    }
  }

  const fetchRoutineExercise = async () => {
    try {
      const { data, error } = await supabase
        .from("routine_exercises")
        .select("*")
        .eq("routine_id", currentRoutineId);
      if (data) {
        setRoutineExercise(data);
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err as Error);
    }
  }

  const getAllRoutineIds = () => {
    return routineExercise.map((routineExercise) => routineExercise.exercise_id.toString());
  }

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .in("id", getAllRoutineIds()
        );

      if (data) {
        setExercises(data);
        setIsLoading(false);
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err as Error);
    }
  }

  const getAllRoutineExercisesIds = () => {
    return routineExercise.map((routineExercise) => routineExercise.id.toString());
  }

  const fetchRoutineExerciseSet = async () => {
    try {
      const { data, error } = await supabase
        .from('routine_exercise_sets')
        .select('*')
        .in('routine_exercise_id', getAllRoutineExercisesIds());
      if (data) {
        setRoutineExerciseSet(data);
      }
      if (error) {
        throw new Error(error.message);
      }
    } catch (err) {
      setError(err as Error);
    }
  }

  useEffect(() => {
    fetchRoutine();
    fetchRoutineExercise();
  }, []);

  useEffect(() => {
    fetchExercises();
    fetchRoutineExerciseSet();
  }, [routineExercise])

  const handleExerciseSetUpdate = async (updatedSet: RoutineExerciseSet) => {
    const updatedSets = routineExerciseSet.map(set =>
      set.id === updatedSet.id ? updatedSet : set
    );
    //TODO: this will be make problems at moment I want to update a set number, I need to change the filter
    setRoutineExerciseSet(updatedSets);
    const { error } = await supabase.from('routine_exercise_sets').update(updatedSet).eq('id', updatedSet.id);
    if (error) {
      toast.error(`Error updating routine exercise set: ${error.message}`);
    } else {
      toast.success('Routine exercise set updated successfully');
    }
  };

  const handleExerciseSetDeletion = async (id: number) => {
    try {
      const { error } = await supabase
        .from('routine_exercise_sets')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setRoutineExerciseSet(routineExerciseSet.filter(set => set.id !== id));
      toast.success("Exercise set deleted successfully");
    } catch (error) {
      toast.error(`Error deleting exercise set: ${(error as Error).message}`);
    }
  };

  const getLastSetNumber = (routineExerciseId: number): number => {
    const toAddExerciseSet = routineExerciseSet.filter(set => set.routine_exercise_id === routineExerciseId);
    return toAddExerciseSet[toAddExerciseSet.length - 1]?.set_number + 1 || 1;
  };

  const handleExerciseSetCreation = async (routineExerciseId: number) => {
    const { data, error } = await supabase
      .from('routine_exercise_sets')
      .insert({
        routine_exercise_id: routineExerciseId,
        set_number: getLastSetNumber(routineExerciseId),
        suggested_weight: 0,
        suggested_repetitions: 0,
      })
      .select();
    if (error) {
      toast.error(`Error creating exercise set: ${error.message}`);
    } else if (data) {
      fetchRoutineExerciseSet();
      toast.success("Exercise set created successfully");
    }
  }

  const handleExerciseDeletion = async (id: number) => {
    try {
      const { error } = await supabase
        .from('routine_exercises')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setRoutineExercise(routineExercise.filter(exercise => exercise.id !== id));
      toast.success("Exercise deleted successfully");
    } catch (error) {
      toast.error(`Error deleting exercise: ${(error as Error).message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Rutina: {routine?.name}</h1>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-3xl font-bold mb-8">Rutina de {routine?.name}</h1>
        </div>
        <ExerciseSetList
          routineExercises={routineExercise}
          routineExerciseSets={routineExerciseSet}
          exercises={exercises}
          onUpdate={handleExerciseSetUpdate}
          onDeleteSet={handleExerciseSetDeletion}
          onDeleteExercise={handleExerciseDeletion}
          onAdd={handleExerciseSetCreation}
          routine_id={currentRoutineId}
        />
      </div>
    </ErrorBoundary>
  );
}
