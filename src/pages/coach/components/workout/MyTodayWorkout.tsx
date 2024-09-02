import supabase from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import { Exercise, Routine, RoutineExercise, RoutineExerciseSet, routineLog, UserRoutine, WorkoutHistory } from "interfaces/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MyTodayWorkout = ({ userId }: { userId: number }) => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [userRoutines, setUserRoutines] = useState<UserRoutine[]>([]);
    const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
    const [routineExerciseSets, setRoutineExerciseSets] = useState<RoutineExerciseSet[]>([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRoutineSelected, setIsRoutineSelected] = useState(false);

    useEffect(() => {
        fetchUserRoutines();
    }, []);

    useEffect(() => {
        fetchRoutines();
    }, [userRoutines]);

    useEffect(() => {
        if (isRoutineSelected && selectedRoutineId) {
            fetchExerciseRoutines(selectedRoutineId);
        }
        fetchExercises();
    }, [isRoutineSelected])

    useEffect(() => {
        if (routineExercises.length > 0) {
            fetchRoutineExerciseSets()
        }
    }, [routineExercises]);

    useEffect(() => {
        if (routineExerciseSets.length > 0) {
            // const sets = routineExerciseSets.map((exercise) => exercise.set_number);
            // const totalSets = sets.reduce((acc, val) => acc + val, 0);
            // setCompletedSets(Array(totalSets).fill(false));
        }
    }, [routineExerciseSets]);

    const saveWorkoutHistory = async (workoutHistoryData: Omit<WorkoutHistory, "id">) => {
        try {
            const { error } = await supabase
                .from('workout_history')
                .insert(workoutHistoryData);
            if (error) throw error;
            console.log('Workout history saved successfully');
        } catch (error) {
            console.error('Error saving workout history:', error);
        }
    };

    const saveRoutineLog = async () => {
        const routineLog: Omit<routineLog, "id"> = {
            user_id: userId,
            routine_id: selectedRoutineId!,
            completed_at: new Date(),
        };
        try {
            const { error } = await supabase
                .from("routine_logs")
                .insert(routineLog);
            if (error) throw error;
            console.log('Routine log saved successfully');
            window.location.href = "/coach/workout-done";
        } catch (error) {
            console.error('Error saving routine log:', error);
        }
    }

    const fetchUserRoutines = async () => {
        try {
            const { data, error } = await supabase
                .from("user_routines")
                .select("*")
                .eq("user_id", userId);
            if (error) {
                throw new Error(error.message);
            }
            setUserRoutines(data as UserRoutine[]);
        } catch (err) {
            setError("Error al obtener las rutinas");
        } finally {
            setIsLoading(false);
        }
    }

    const getAllRoutineIds = () => {
        return userRoutines.map((userRoutine) => userRoutine.routine_id);
    }

    // get all the routines, then I need to filter by user selected and show specific routines
    const fetchRoutines = async () => {
        try {
            const { data, error } = await supabase
                .from("routines")
                .select("*")
                .in("id", getAllRoutineIds());
            if (error) {
                throw new Error(error.message);
            }
            setRoutines(data as Routine[]);
        } catch (err) {
            setError("Error al obtener las rutinas");
        } finally {
            setIsLoading(false);
        }
    };

    // get all the routine exercises by routine id
    const fetchExerciseRoutines = async (routine_id: number) => {
        try {
            const { data, error } = await supabase
                .from("routine_exercises")
                .select("*")
                .eq("routine_id", routine_id);
            if (error) {
                throw new Error(error.message);
            }
            setRoutineExercises(data as RoutineExercise[]);
        } catch (error) {
            console.error("Error al obtener los sets de ejercicios:", error);
        }
    };

    const getAllRoutineExercisesIds = () => {
        return routineExercises.filter((routineExercise) => routineExercise.routine_id === selectedRoutineId);
    };

    const fetchRoutineExerciseSets = async () => {
        try {
            const routineExerciseIds = getAllRoutineExercisesIds().map(exercise => exercise.id);
            const { data, error } = await supabase
                .from("routine_exercise_sets")
                .select("*")
                .in("routine_exercise_id", routineExerciseIds);
            if (error) {
                throw new Error(error.message);
            }
            setRoutineExerciseSets(data as RoutineExerciseSet[]);
        } catch (error) {
            console.error("Error al obtener los sets de ejercicios:", error);
        }
    };

    const getAllExerciseIds = () => {
        return routineExercises.map((exercise) => exercise.exercise_id);
    }

    const fetchExercises = async () => {
        try {
            const { data, error } = await supabase
                .from("exercises")
                .select("*")
                .order("name", { ascending: true })
                .in("id", getAllExerciseIds());
            if (error) {
                throw new Error(error.message);
            }
            setExercises(data as Exercise[]);
        } catch (err) {
            setError("Error al obtener los usuarios");
        } finally {
            setIsLoading(false);
        }
    };

    const getSelectedRoutineName = () => {
        const routine = routines.find((routine) => routine.id === selectedRoutineId);
        return routine ? routine.name : "Rutina no encontrada";
    };

    /**
     * Handles the change of selected routine.
     * Fetches exercise sets for the selected routine and updates the state.
     * @param event - The change event from the routine select element.
     */
    const handleRoutineChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const routine_id = parseInt(event.target.value);
        setSelectedRoutineId(routine_id);
        await fetchExerciseRoutines(routine_id);
        setIsRoutineSelected(true);
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const RoutineSelector = () => (
        <div className="mb-6">
            <select
                className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRoutineId || ""}
                onChange={handleRoutineChange}
            >
                <option value="">Seleccionar rutina</option>
                {routines.map((routine) => (
                    <option key={routine.id} value={routine.id}>
                        {routine.name}
                    </option>
                ))}
            </select>
        </div>
    )

    const SelectedRoutine = ({ routineName }: { routineName: string }) => (
        <>
            <div className="flex justify-between mb-4">
                <h3 className="text-2xl font-semibold">{routineName}</h3>
                <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold rounded p-2 ml-2 flex items-center justify-center"
                    onClick={() => { setSelectedRoutineId(null); setIsRoutineSelected(false); }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            {routineExercises.map((routineExercise) => (
                <ExerciseCard
                    key={routineExercise.id}
                    exercise={exercises.find(e => e.id === routineExercise.exercise_id)}
                    routineExercise={routineExercise}
                    sets={routineExerciseSets.filter(set => set.routine_exercise_id === routineExercise.id)}
                />
            ))}

            <div>
                <button onClick={() => { saveRoutineLog() }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                    Terminar Rutina
                </button>
            </div>
        </>
    )

    const ShowExerciseInformation = ({ exercise }: { exercise: Exercise }) => {
        return (
            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded p-2 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Más información del ejercicio</DialogTitle>
                            <DialogDescription>
                                <strong>
                                    {exercise?.name}
                                </strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 space-y-4">
                            <h5 className="text-xl font-semibold mb-4">Detalles del ejercicio</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Descripción:</p>
                                    <p className="text-gray-600">{exercise?.description}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Categoría:</p>
                                    <p className="text-gray-600">{exercise?.category}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Músculo objetivo:</p>
                                    <p className="text-gray-600">{exercise?.target_muscle}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Equipo:</p>
                                    <p className="text-gray-600">{exercise?.equipment}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Dificultad:</p>
                                    <p className="text-gray-600">{exercise?.difficulty}</p>
                                </div>
                            </div>
                            <div>
                                <p className="font-medium mb-2">Instrucciones:</p>
                                <ol className="list-decimal pl-5 space-y-2">
                                    {exercise?.instructions?.split(`\n`).map((instruction, index) => (
                                        <li key={index} className="text-gray-600">
                                            {instruction.trim()}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            {exercise?.video_url && (
                                <div>
                                    <p className="font-medium">Video:</p>
                                    <a href={exercise?.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">Ver video</a>
                                </div>
                            )}
                            {exercise?.image_url && (
                                <div>
                                    <p className="font-medium mb-2">Imagen:</p>
                                    <img src={exercise?.image_url} alt="exercise image" className="max-w-full h-auto rounded-lg shadow-md" />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    const ExerciseCard = ({ exercise, routineExercise, sets }: { exercise: Exercise | undefined, routineExercise: RoutineExercise, sets: RoutineExerciseSet[] }) => (
        <div className="mb-6 border p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold">{exercise?.name}</h4>
                {exercise && <ShowExerciseInformation exercise={exercise} />}
            </div>
            <div className="mb-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-center">Serie</th>
                            <th className="p-2 text-center">Repeticiones</th>
                            <th className="p-2 text-center">Peso</th>
                            <th className="p-2 text-center">Completado</th>
                            <th className="p-2 text-center">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sets.map((set) => (
                            <ExerciseSet key={set.id} set={set} routineExerciseId={routineExercise.id} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    const ExerciseSet = ({ set, routineExerciseId }: { set: RoutineExerciseSet, routineExerciseId: number }) => {
        const [weight, setWeight] = useState(set.suggested_weight);
        const [reps, setReps] = useState(set.suggested_repetitions);
        const [isEditingSet, setIsEditingSet] = useState(false);
        const [isCompleted, setIsCompleted] = useState(false);

        const saveWorkout = () => {
            const workoutHistoryData: Omit<WorkoutHistory, 'id'> = {
                user_id: userId,
                routine_exercise_id: routineExerciseId,
                set_number: set.set_number,
                weight: weight,
                repetitions: reps,
                date_completed: new Date(),
            };
            saveWorkoutHistory(workoutHistoryData);
        }

        return (
            <>
                {!isEditingSet && (
                    <tr key={set.id} className="border-b">
                        <td className="p-2 text-gray-700 font-semibold text-center">Set {set.set_number}</td>
                        <td className="p-2 text-gray-700 text-center">{reps} reps</td>
                        <td className="p-2 text-gray-700 text-center">{weight} kg</td>
                        <td className="p-2 text-center">
                            <input
                                type="checkbox"
                                id={`set-${set.id}`}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                        saveWorkout();
                                        setIsCompleted(true);
                                    }
                                }}
                                disabled={isCompleted}
                            />
                        </td>
                        <td className="p-2 text-center">
                            <button className="text-blue-500" onClick={() => setIsEditingSet(!isEditingSet)} disabled={isCompleted}>Editar</button>
                        </td>
                    </tr>
                )}
                {isEditingSet && (
                    <tr key={set.id} className="border-b">
                        <td className="p-2 text-gray-700 font-semibold text-center">Set {set.set_number}</td>
                        <td className="p-2 text-gray-700 text-center">
                            <input
                                type="number"
                                value={reps}
                                onChange={(e) => setReps(Number(e.target.value))}
                                className="w-20 p-1 border rounded"
                            />
                        </td>
                        <td className="p-2 text-gray-700 text-center">
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(Number(e.target.value))}
                                className="w-20 p-1 border rounded"
                            />
                        </td>
                        <td className="p-2"></td>
                        <td className="p-2 text-center">
                            <button className="text-blue-500" onClick={() => setIsEditingSet(!isEditingSet)}>Fijar</button>
                        </td>
                    </tr>
                )}
            </>
        );
    };
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6">Rutina del día</h2>
            {!isRoutineSelected ? (
                <RoutineSelector />
            ) : (
                <SelectedRoutine
                    routineName={getSelectedRoutineName()}
                />
            )}
        </div>
    )



}

export default MyTodayWorkout