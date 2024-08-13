// src/coach/pages/TodayWorkout.tsx
import { useState, useEffect } from "react";
import supabase from "../../../utils/supabaseClient";
import type { Routine, ExerciseSet } from "../../../../interfaces/types";

const TodayWorkout = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
    const [completedSets, setCompletedSets] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRoutineSelected, setIsRoutineSelected] = useState(false);

    useEffect(() => {
        fetchRoutines();
    }, []);

    useEffect(() => {
        console.log(exerciseSets);
        console.log(completedSets);
    }, [exerciseSets, completedSets]);


    const fetchRoutines = async () => {
        try {
            const { data: routinesData, error: routinesError } = await supabase.from("routines").select("*");

            if (routinesError) {
                throw new Error(routinesError.message);
            }

            setRoutines(routinesData as Routine[]);
        } catch (err) {
            setError("Error al obtener las rutinas");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExerciseSets = async (routineId: number) => {
        try {
            const { data: exerciseSetsData, error: exerciseSetsError } = await supabase
                .from("exercisesets")
                .select("*")
                .eq("routineid", routineId);

            if (exerciseSetsError) {
                throw new Error(exerciseSetsError.message);
            }

            const exerciseSetsWithNames = await Promise.all(
                exerciseSetsData.map(async (exerciseSet) => {
                    const exerciseName = await getExerciseName(exerciseSet.exerciseId);
                    return { ...exerciseSet, exerciseName };
                })
            );

            setExerciseSets(exerciseSetsWithNames);
            setCompletedSets(new Array(exerciseSetsWithNames.length).fill(false));
        } catch (error) {
            console.error("Error al obtener los sets de ejercicios:", error);
        }
    };


    const getExerciseName = async (exerciseId: number) => {
        try {
            const { data, error } = await supabase
                .from("exercises")
                .select("name")
                .eq("id", exerciseId)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data.name;
        } catch (error) {
            console.error("Error al obtener el nombre del ejercicio:", error);
            return "";
        }
    };


    const handleRoutineChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const routineId = parseInt(event.target.value);
        setSelectedRoutineId(routineId);
        await fetchExerciseSets(routineId);
        setIsRoutineSelected(true);
    };

    const handleSetCompletion = (index: number, completed: boolean) => {
        const updatedCompletedSets = [...completedSets];
        updatedCompletedSets[index] = completed;
        setCompletedSets(updatedCompletedSets);
    };

    const handleWeightChange = (exerciseIndex: number, value: number) => {
        const updatedExerciseSets = [...exerciseSets];
        updatedExerciseSets[exerciseIndex].weight = value;
        setExerciseSets(updatedExerciseSets);
    };

    const handleRepetitionsChange = (exerciseIndex: number, value: number) => {
        const updatedExerciseSets = [...exerciseSets];
        updatedExerciseSets[exerciseIndex].repetitions = value;
        setExerciseSets(updatedExerciseSets);
    };

    const handleFinishRoutine = () => {
        setSelectedRoutineId(null);
        setExerciseSets([]);
        setCompletedSets([]);
        setIsRoutineSelected(false);
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-4">Rutina del día</h2>
            {!isRoutineSelected && (
                <div className="mb-4">
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
            )}
            {exerciseSets.length > 0 && (
                <>
                    <h2 className="text-xl font-semibold mb-4">{routines.find(routine => routine.id === selectedRoutineId)?.name}</h2>
                    <h3 className="text-xl font-semibold mb-2">Lista de Ejercicios</h3>
                    {exerciseSets.map((exerciseSet, exerciseIndex) => (
                        <div key={exerciseSet.id} className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Ejercicio: {exerciseSet.exerciseName}</h3>
                            {Array.from({ length: exerciseSet.setnumber }).map((_, setIndex) => (
                                <div key={`${exerciseSet.id}-${setIndex}`} className="bg-gray-100 p-4 rounded-lg mb-4">
                                    <p className="text-lg font-medium mb-2">Set: {setIndex + 1}</p>
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <label htmlFor={`weight-${exerciseIndex}-${setIndex}`} className="mr-2">
                                                Peso:
                                            </label>
                                            <input
                                                type="number"
                                                id={`weight-${exerciseIndex}-${setIndex}`}
                                                className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={exerciseSet.weight}
                                                onChange={(e) =>
                                                    handleWeightChange(exerciseIndex, parseInt(e.target.value))
                                                }
                                                disabled={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex]}
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`repetitions-${exerciseIndex}-${setIndex}`} className="mr-2">
                                                Repeticiones:
                                            </label>
                                            <input
                                                type="number"
                                                id={`repetitions-${exerciseIndex}-${setIndex}`}
                                                className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={exerciseSet.repetitions}
                                                onChange={(e) =>
                                                    handleRepetitionsChange(exerciseIndex, parseInt(e.target.value))
                                                }
                                                disabled={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex]}
                                            />
                                        </div>
                                    </div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                            checked={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex] || false}
                                            onChange={(e) =>
                                                handleSetCompletion(
                                                    exerciseIndex * exerciseSet.setnumber + setIndex,
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="ml-2">Completado</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button
                        className="block w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleFinishRoutine}
                    >
                        Terminar rutina
                    </button>
                </>
            )}
        </div>
    );
};

export default TodayWorkout;
