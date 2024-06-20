import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import type { Exercise } from "../../../interfaces/types";


const Exercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const { data, error } = await supabase.from("exercises").select("*");

            if (error) {
                throw new Error(error.message);
            }

            setExercises(data as Exercise[]);
        } catch (err) {
            setError("Error al obtener los ejercicios");
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
            <h1 className="text-3xl font-bold mb-8">Ejercicios</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Categoría</th>
                        <th className="px-4 py-2">Músculo objetivo</th>
                        <th className="px-4 py-2">Equipo</th>
                        <th className="px-4 py-2">Dificultad</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((exercise) => (
                        <tr key={exercise.id} className="border-t">
                            <td className="px-4 py-2">{exercise.name}</td>
                            <td className="px-4 py-2">{exercise.category}</td>
                            <td className="px-4 py-2">{exercise.target_muscle}</td>
                            <td className="px-4 py-2">{exercise.equipment}</td>
                            <td className="px-4 py-2">{exercise.difficulty}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Exercises;
