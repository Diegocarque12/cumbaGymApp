import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { WeightTypes } from 'interfaces/types';
import supabase from '@/utils/supabaseClient';

interface ExerciseFormProps {
    onSubmit: (formData: formData) => void;
}

interface ExercisesByName {
    id: number;
    name: string;
}

interface formData {
    exercise_id: number;
    weight_type_id: number;
}

export default function ExerciseForm({ onSubmit }: ExerciseFormProps) {
    const [exercises, setExercises] = useState<ExercisesByName[]>([]);
    const [weightTypes, setWeightTypes] = useState<WeightTypes[]>([]);
    const [formData, setFormData] = useState({
        exercise_id: 0,
        weight_type_id: 0
    });

    const fetchAllExercises = async () => {
        const { data, error } = await supabase
            .from('exercises')
            .select('id, name');
        if (error) {
            console.error('Error fetching exercises:', error);
            return;
        }
        setExercises(data);
    }

    const fetchAllWeights = async () => {
        const { data, error } = await supabase
            .from('weight_types')
            .select('*');
        if (error) {
            console.error('Error fetching weight_types:', error);
            return;
        }
        setWeightTypes(data);
    }

    useEffect(() => {
        fetchAllExercises();
        fetchAllWeights();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "exercise_id" ? parseInt(value) : Number(value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="exercise_id" className="block text-sm font-medium text-gray-700">
                    Nombre del Ejercicio
                </label>
                <select
                    id="exercise_id"
                    name="exercise_id"
                    value={formData.exercise_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Seleccione un ejercicio</option>
                    {exercises?.map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="weight_type_id" className="block text-sm font-medium text-gray-700">
                    Tipo de Peso
                </label>
                <select
                    id="weight_type_id"
                    name="weight_type_id"
                    value={formData.weight_type_id}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value="">Seleccione un tipo de peso</option>
                    {weightTypes?.map((weightType) => (
                        <option key={weightType.id} value={weightType.id}>
                            {weightType.name}
                        </option>
                    ))}
                </select>
            </div>
            <Button type="submit">
                Agregar Lista de Ejercicios
            </Button>
        </form>
    );
}