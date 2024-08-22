import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import { Exercise, ExerciseSet, Routine } from "../../../../interfaces/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import ErrorBoundary from "@/components/ErrorBoundary";
import AssignRoutineDialog from "../components/routine/AssignRoutineDialog";
import ExerciseSetForm from "../components/routine/ExerciseSetForm";
import ExerciseSetList from "../components/routine/ExerciseSetList";

const ITEMS_PER_PAGE = 10;

export default function RoutineDetails() {
  const { routineId } = useParams<{ routineId: string }>();
  const currentRoutineId = Number(routineId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [routineData, exerciseSetsData, exercisesData] = await Promise.all([
        supabase.from("routines").select("*").eq("id", currentRoutineId).single(),
        supabase.from("exercisesets").select("*, exercises(name)").eq("routineId", currentRoutineId),
        supabase.from("exercises").select("*")
      ]);

      if (routineData.error) throw routineData.error;
      if (exerciseSetsData.error) throw exerciseSetsData.error;
      if (exercisesData.error) throw exercisesData.error;

      setRoutine(routineData.data as Routine);
      setExerciseSets(exerciseSetsData.data as ExerciseSet[]);
      setExercises(exercisesData.data as Exercise[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [currentRoutineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateExerciseSet = async (updatedSet: ExerciseSet) => {
    try {
      const { error } = await supabase
        .from("exercisesets")
        .update(updatedSet)
        .eq("id", updatedSet.id);
      if (error) throw error;
      toast.success("Exercise set updated successfully");
      fetchData();
    } catch (error) {
      toast.error(`Error updating exercise set: ${(error as Error).message}`);
    }
  };

  const handleExerciseSetUpdate = useCallback((updatedSet: ExerciseSet) => {
    updateExerciseSet(updatedSet);
  }, []);

  const deleteExerciseSet = async (id: number) => {
    try {
      const { error } = await supabase.from("exercisesets").delete().eq("id", id);
      if (error) throw error;
      toast.success("Exercise set deleted successfully");
      fetchData();
    } catch (error) {
      toast.error(`Error deleting exercise set: ${(error as Error).message}`);
    }
  };

  const handleExerciseSetCreation = useCallback(async (newSet: Omit<ExerciseSet, "id">) => {
    try {
      const { error } = await supabase.from("exercisesets").insert(newSet);
      if (error) throw error;
      toast.success("Exercise set created successfully");
      fetchData();
    } catch (error) {
      toast.error(`Error creating exercise set: ${(error as Error).message}`);
    }
  }, [fetchData]);

  const handleExerciseSetDeletion = useCallback((id: number) => {
    deleteExerciseSet(id);
  }, []);

  const deleteRoutine = async (currentRoutineId: string) => {
    try {
      const { error } = await supabase.from("routines").delete().eq("id", currentRoutineId);
      if (error) throw error;
      toast.success("Routine deleted successfully");
      window.location.href = "/coach/routines";
    } catch (error) {
      toast.error(`Error deleting routine: ${(error as Error).message}`);
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

  const paginatedExerciseSets = exerciseSets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold mb-8">Rutina: {routine?.name}</h1>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm("¿Estás seguro de que quieres eliminar esta rutina?")) {
                // Add the delete routine logic here
                // For example:
                deleteRoutine(currentRoutineId)
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar Rutina
          </Button>
        </div>
        <div className="flex justify-between mb-6">
          <AssignRoutineDialog routineId={currentRoutineId} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Crear nueva serie de ejercicio</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear nueva serie de ejercicio</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Crea una nueva serie de ejercicio para esta rutina.
              </DialogDescription>
              <ExerciseSetForm
                exercises={exercises}
                onSubmit={(newSet) => {
                  handleExerciseSetCreation(newSet);
                  setIsDialogOpen(false);
                }}
                routineId={currentRoutineId}
              />
            </DialogContent>
          </Dialog>
        </div>
        <ExerciseSetList
          exerciseSets={paginatedExerciseSets}
          exercises={exercises}
          onUpdate={handleExerciseSetUpdate}
          onDelete={handleExerciseSetDeletion}
          routineId={currentRoutineId}
        />
        {exerciseSets.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="mx-4">
              Página {page} de {Math.ceil(exerciseSets.length / ITEMS_PER_PAGE)}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(Math.ceil(exerciseSets.length / ITEMS_PER_PAGE), p + 1))}
              disabled={page === Math.ceil(exerciseSets.length / ITEMS_PER_PAGE)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
