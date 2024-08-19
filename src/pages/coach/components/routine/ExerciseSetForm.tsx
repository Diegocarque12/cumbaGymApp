import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Exercise, ExerciseSet } from 'interfaces/types';

interface ExerciseSetFormProps {
    exercises: Exercise[];
    onSubmit: (newSet: Omit<ExerciseSet, "id">) => void;
    routineId: number;
    initialValues?: ExerciseSet;
}

export default function ExerciseSetForm({ exercises, onSubmit, routineId, initialValues }: ExerciseSetFormProps) {
    const [formData, setFormData] = useState<Omit<ExerciseSet, "id">>({
        routineId,
        exerciseId: initialValues?.exerciseId || 0,
        setnumber: initialValues?.setnumber || 0,
        weight: initialValues?.weight || 0,
        repetitions: initialValues?.repetitions || 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "exerciseId" ? parseInt(value) : Number(value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="exerciseId" className="block text-sm font-medium text-gray-700">
                    Ejercicio
                </label>
                <select
                    id="exerciseId"
                    name="exerciseId"
                    value={formData.exerciseId}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Seleccionar ejercicio</option>
                    {exercises.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="setnumber" className="block text-sm font-medium text-gray-700">
                    Número de Series
                </label>
                <input
                    type="number"
                    id="setnumber"
                    name="setnumber"
                    value={formData.setnumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                    Peso
                </label>
                <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700">
                    Repeticiones
                </label>
                <input
                    type="number"
                    id="repetitions"
                    name="repetitions"
                    value={formData.repetitions}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <Button type="submit">
                {initialValues ? 'Actualizar' : 'Agregar'} Serie de Ejercicios
            </Button>
        </form>
    );
}