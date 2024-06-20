import { useState, useEffect } from "react";
import supabase from "../../utils/supabaseClient";
import type { Exercise } from "../../../interfaces/types";

const Exercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [showAddExercise, setShowAddExercise] = useState(false);
    const [newExercise, setNewExercise] = useState<Exercise>({
        id: 0,
        name: "",
        description: "",
        category: "",
        target_muscle: "",
        equipment: "",
        difficulty: "",
        instructions: "",
        video_url: "",
        image_url: "",
    });
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

    const handleExerciseClick = (exercise: Exercise) => {
        setSelectedExercise(exercise);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewExercise((prevExercise) => ({
            ...prevExercise,
            [name]: value,
        }));
    };

    const handleCreateExercise = async () => {
        try {
            const { data, error } = await supabase.from("exercises").insert([newExercise]);

            if (error) {
                throw new Error(error.message);
            }

            setExercises((prevExercises) => [...prevExercises, ...(data ?? [])]);
            setNewExercise({
                id: 0,
                name: "",
                description: "",
                category: "",
                target_muscle: "",
                equipment: "",
                difficulty: "",
                instructions: "",
                video_url: "",
                image_url: "",
            });
            setShowAddExercise(false);
        } catch (err) {
            setError("Error al crear el ejercicio");
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Lista de Ejercicios</h2>
                    <ul className="space-y-4">
                        {exercises.map((exercise) => (
                            <li
                                key={exercise.id}
                                className="cursor-pointer hover:bg-gray-100 p-4 rounded"
                                onClick={() => handleExerciseClick(exercise)}
                            >
                                {exercise.name}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {selectedExercise && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Detalles del Ejercicio</h2>
                            <p>
                                <strong>Nombre:</strong> {selectedExercise.name}
                            </p>
                            <p>
                                <strong>Descripción:</strong> {selectedExercise.description}
                            </p>
                            <p>
                                <strong>Categoría:</strong> {selectedExercise.category}
                            </p>
                            <p>
                                <strong>Músculo objetivo:</strong> {selectedExercise.target_muscle}
                            </p>
                            <p>
                                <strong>Equipo:</strong> {selectedExercise.equipment}
                            </p>
                            <p>
                                <strong>Dificultad:</strong> {selectedExercise.difficulty}
                            </p>
                            <p>
                                <strong>Instrucciones:</strong> {selectedExercise.instructions}
                            </p>
                            {selectedExercise.video_url && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-bold mb-2">Video demostrativo</h3>
                                    <video src={selectedExercise.video_url} controls className="w-full"></video>
                                </div>
                            )}
                            {selectedExercise.image_url && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-bold mb-2">Imagen ilustrativa</h3>
                                    <img src={selectedExercise.image_url} alt={selectedExercise.name} className="w-full" />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <button
                    onClick={() => setShowAddExercise(!showAddExercise)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {showAddExercise ? "Cancelar" : "Agregar Ejercicio"}
                </button>
                {showAddExercise && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="name" className="block mb-1">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newExercise.name}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-1">
                                Descripción:
                            </label>
                            <textarea
                                name="description"
                                value={newExercise.description}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="category" className="block mb-1">
                                Categoría:
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={newExercise.category}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="target_muscle" className="block mb-1">
                                Músculo objetivo:
                            </label>
                            <input
                                type="text"
                                name="target_muscle"
                                value={newExercise.target_muscle}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="equipment" className="block mb-1">
                                Equipo:
                            </label>
                            <input
                                type="text"
                                name="equipment"
                                value={newExercise.equipment}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="difficulty" className="block mb-1">
                                Dificultad:
                            </label>
                            <input
                                type="text"
                                name="difficulty"
                                value={newExercise.difficulty}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="instructions" className="block mb-1">
                                Instrucciones:
                            </label>
                            <textarea
                                name="instructions"
                                value={newExercise.instructions}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="video_url" className="block mb-1">
                                URL del video:
                            </label>
                            <input
                                type="text"
                                name="video_url"
                                value={newExercise.video_url}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="image_url" className="block mb-1">
                                URL de la imagen:
                            </label>
                            <input
                                type="text"
                                name="image_url"
                                value={newExercise.image_url}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <button
                            onClick={handleCreateExercise}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Crear Ejercicio
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Exercises;
