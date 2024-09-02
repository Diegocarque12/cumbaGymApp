import { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { RoutineExerciseSet } from "interfaces/types";

const useFetchRoutineExerciseSets = (
  selectedRoutineId: number,
  userId: number
) => {
  const [exerciseSets, setExerciseSets] = useState<RoutineExerciseSet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExerciseSets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("routine_exercise_sets")
          .select("*")
          .eq("routine_id", selectedRoutineId)
          .eq("user_id", userId)
          .order("set_number", { ascending: true });

        if (error) throw new Error(error.message);
        setExerciseSets(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error al obtener los sets de ejercicios:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedRoutineId && userId) {
      fetchExerciseSets();
    }
  }, [selectedRoutineId, userId]);

  return { exerciseSets, isLoading, error };
};

export default useFetchRoutineExerciseSets;
