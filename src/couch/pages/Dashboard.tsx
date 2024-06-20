// src/couch/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import type { Routine, ExerciseSet } from "../../../interfaces/types";

const Dashboard = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data: routinesData, error: routinesError } = await supabase
                .from("routines")
                .select("*");

            if (routinesError) {
                throw new Error(routinesError.message);
            }

            const { data: exerciseSetsData, error: exerciseSetsError } = await supabase
                .from("exercisesets")
                .select("*");

            if (exerciseSetsError) {
                throw new Error(exerciseSetsError.message);
            }

            setRoutines(routinesData as Routine[]);
            setExerciseSets(exerciseSetsData as ExerciseSet[]);
        } catch (err) {
            setError("Error al obtener los datos");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Rutinas</h2>
                    <ul className="space-y-4">
                        {routines.map((routine) => (
                            <li key={routine.id} className="flex justify-between items-center">
                                <span>{routine.name}</span>
                                <span className="text-gray-500">{routine.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Sets de Ejercicios</h2>
                    <ul className="space-y-4">
                        {exerciseSets.map((exerciseSet) => (
                            <li key={exerciseSet.id} className="flex justify-between items-center">
                                <span>{exerciseSet.exerciseId}</span>
                                <span className="text-gray-500">
                                    {exerciseSet.setnumber} sets - {exerciseSet.repetitions} reps
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Estadísticas</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Total de Rutinas</h3>
                        <p className="text-3xl">{routines.length}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Total de Sets de Ejercicios</h3>
                        <p className="text-3xl">{exerciseSets.length}</p>
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-2">Rutinas Completadas</h3>
                        <p className="text-3xl">0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
