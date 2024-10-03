import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RoutineExerciseSet } from 'interfaces/types';
interface ExerciseSetFormProps {
    onSubmit: (newSet: Omit<RoutineExerciseSet, "id">) => void;
    initialValues?: RoutineExerciseSet;
}

export default function ExerciseSetForm({ onSubmit, initialValues }: ExerciseSetFormProps) {
    const [formData, setFormData] = useState<Omit<RoutineExerciseSet, "id">>({
        routine_exercise_id: initialValues?.routine_exercise_id || 0,
        set_number: initialValues?.set_number || 1,
        suggested_weight: initialValues?.suggested_weight || 0,
        suggested_repetitions: initialValues?.suggested_repetitions || 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "routine_exercise_id" ? parseInt(value) : Number(value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="set_number" className="block text-sm font-medium text-gray-700">
                    Número de Serie
                </label>
                <input
                    type="number"
                    id="set_number"
                    name="set_number"
                    value={formData.set_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="suggested_weight" className="block text-sm font-medium text-gray-700">
                    Peso Sugerido
                </label>
                <input
                    type="number"
                    id="suggested_weight"
                    name="suggested_weight"
                    value={formData.suggested_weight}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <div>
                <label htmlFor="suggested_repetitions" className="block text-sm font-medium text-gray-700">
                    Repeticiones Sugeridas
                </label>
                <input
                    type="number"
                    id="suggested_repetitions"
                    name="suggested_repetitions"
                    value={formData.suggested_repetitions}
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
