import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import { Exercise, Routine, RoutineExercise, RoutineExerciseSet } from "../../../../interfaces/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "react-toastify";
import ErrorBoundary from "@/components/ErrorBoundary";
import AssignRoutineDialog from "../components/routine/AssignRoutineDialog";
import ExerciseSetList from "../components/routine/ExerciseSetList";
import ExerciseForm from "../components/routine/ExerciseForm";

// const ITEMS_PER_PAGE = 3;

export default function RoutineDetails() {
  const { routine_id } = useParams<{ routine_id: string }>();
  const currentRoutineId = Number(routine_id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [routine, setRoutine] = useState<Routine>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routineExercise, setRoutineExercise] = useState<RoutineExercise[]>([]);
  const [routineExerciseSet, setRoutineExerciseSet] = useState<RoutineExerciseSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // const [page, setPage] = useState(1);

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


  const deleteRoutine = async () => {
    try {
      const { error } = await supabase.from("routines").delete().eq("id", currentRoutineId);
      if (error) throw error;
      toast.success("Routine deleted successfully");
      window.location.href = "/admin/routines";
    } catch (error) {
      toast.error(`Error deleting routine: ${(error as Error).message}`);
    }
  };

  const updateRoutineName = async (newName: string) => {
    try {
      const { error } = await supabase.from("routines").update({ name: newName }).eq("id", currentRoutineId);
      if (error) throw error;
      toast.success("Routine name updated successfully");
    } catch (error) {
      toast.error(`Error updating routine name: ${(error as Error).message}`);
    }
  };

  const handleExerciseSetUpdate = async (updatedSet: RoutineExerciseSet) => {
    const updatedSets = routineExerciseSet.map(set =>
      set.id === updatedSet.id ? updatedSet : set
    );
    // this will be make problems at moment I want to update a set number, I need to change the filter
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

  const handleAddExerciseToRoutine = async (formData: { exercise_id: number, weight_type_id: number }) => {
    const { error } = await supabase
      .from('routine_exercises')
      .insert({
        routine_id: currentRoutineId,
        exercise_id: formData.exercise_id,
        weight_type_id: formData.weight_type_id,
      })
    if (error) {
      toast.error(`Error adding exercise to routine: ${error.message}`);
    } else {
      toast.success("Exercise added to routine successfully");
      fetchRoutineExercise();
      setIsDialogOpen(false);
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

  // const paginatedExerciseSets = routineExerciseSet.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-3xl font-bold mb-8">Rutina de {routine?.name}</h1>
          <div className="flex items-center gap-2 border-b border-b-slate-400 pb-4 md:border-b-0 md:pb-0">
            <Button
              className="w-auto"
              variant="outline"
              onClick={() => {
                const newName = window.prompt("Ingrese el nuevo nombre para la rutina:", routine?.name)
                if (newName) {
                  updateRoutineName(newName)
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden md:block ml-2">Editar</span>
            </Button>

            <Button
              className="w-auto"
              variant="destructive"
              onClick={() => {
                if (window.confirm("¿Estás seguro de que quieres eliminar esta rutina? Se eliminara toda la información relacionada con esta rutina, menos los ejercicios.")) {
                  deleteRoutine()
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden md:block ml-2">Eliminar</span>
            </Button>
          </div>
        </div>
        <div className="flex justify-between mb-6">
          <AssignRoutineDialog routine_id={currentRoutineId} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                <span className="ml-2 hidden md:block">Agregar serie</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Serie Nueva</DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Crea una nueva serie de ejercicio para esta rutina.
              </DialogDescription>
              <ExerciseForm onSubmit={handleAddExerciseToRoutine} />
            </DialogContent>
          </Dialog>
        </div>
        {routineExercise.length > 0 &&
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
        }
        {routineExercise.length == 0 &&
          <div className="flex flex-col items-center justify-center h-40 bg-gray-100 rounded-md">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-gray-600 font-medium">No hay sets en esta rutina</p>
            <p className="text-gray-400 text-sm mt-1">Agrega un nuevo set para comenzar</p>
          </div>
        }
        {/* {routineExercise.length > ITEMS_PER_PAGE && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="mx-4">
              Página {page} de {Math.ceil(routineExerciseSet.length / ITEMS_PER_PAGE)}
            </span>
            <Button
              onClick={() => setPage((p) => Math.min(Math.ceil(routineExerciseSet.length / ITEMS_PER_PAGE), p + 1))}
              disabled={page === Math.ceil(routineExerciseSet.length / ITEMS_PER_PAGE)}
            >
              Siguiente
            </Button>
          </div>
        )} */}
      </div>
    </ErrorBoundary>
  );
}
