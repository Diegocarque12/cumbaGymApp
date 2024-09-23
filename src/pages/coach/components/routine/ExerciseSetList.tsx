import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExerciseSetForm from './ExerciseSetForm';
import { Exercise, RoutineExercise, RoutineExerciseSet, WeightTypes } from "interfaces/types";
import { GetCompleteWeightType } from '@/utils/WeightType';
import supabase from '@/utils/supabaseClient';

interface ExerciseSetListProps {
    routineExercises: RoutineExercise[];
    routineExerciseSets: RoutineExerciseSet[];
    exercises: Exercise[];
    onUpdate: (updatedSet: RoutineExerciseSet) => void;
    onDeleteSet: (id: number) => void;
    onDeleteExercise: (id: number) => void;
    onAdd: (routineExerciseId: number) => void;
    routine_id: number;
}

const ExerciseSetList = ({
    routineExercises,
    routineExerciseSets,
    exercises,
    onUpdate,
    onDeleteSet,
    onDeleteExercise,
    onAdd,
}: ExerciseSetListProps) => {
    const [, setWeightType] = useState<WeightTypes>();
    const [editingSet, setEditingSet] = useState<RoutineExerciseSet | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isWeightTypeDialogOpen, setIsWeightTypeDialogOpen] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);

    const onUpdateWeightType = async (routineExerciseId: number, newWeightTypeId: number) => {
        setWeightType({
            id: newWeightTypeId,
            name: GetCompleteWeightType(newWeightTypeId),
        });
        console.log(newWeightTypeId, routineExerciseId);

        const { error } = await supabase.from('routine_exercises').update({ weight_type_id: newWeightTypeId }).eq('routine_id', routineExerciseId);
        if (error) {
            console.error('Error updating weight type:', error);
        }
        setIsWeightTypeDialogOpen(false);
        setRefreshPage(true);
    };

    const weightTypes = [
        { id: 1, name: 'Kilos' },
        { id: 2, name: 'Libras' },
        { id: 3, name: 'Pesas' },
    ];

    return (
        <div>
            {routineExercises.map((routineExercise) => {
                const exercise = exercises.find(e => e.id === routineExercise.exercise_id);
                const sets = routineExerciseSets.filter(set => set.routine_exercise_id === routineExercise.id);
                const sortedSets = sets.sort((a, b) => a.set_number - b.set_number);
                return (
                    <div key={routineExercise.id} className="mb-6 border p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold mb-2">{exercise?.name}</h3>
                            <div className='flex items-center'>
                                {refreshPage && (
                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="mr-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out"
                                    >
                                        Refrescar Página
                                    </Button>
                                )}
                                <Dialog open={isWeightTypeDialogOpen} onOpenChange={setIsWeightTypeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="secondary" className="mr-2 bg-blue-600 text-white hover:bg-blue-700">Cambiar Tipo de Peso</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Cambiar el Tipo de Peso</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex flex-col space-y-4">
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                const formData = new FormData(e.target as HTMLFormElement);
                                                const newWeightTypeId = Number(formData.get('weightType'));
                                                onUpdateWeightType(routineExercise.routine_id, newWeightTypeId);
                                            }}>
                                                <div className="flex flex-col space-y-2">
                                                    <label htmlFor="weightType" className="text-sm font-medium text-gray-700">
                                                        Tipo de Peso
                                                    </label>
                                                    <select
                                                        id="weightType"
                                                        name="weightType"
                                                        defaultValue={routineExercise.weight_type_id}
                                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        {weightTypes.map((type) => (
                                                            <option key={type.id} value={type.id}>
                                                                {type.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <Button type="submit" className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    Guardar
                                                </Button>
                                            </form>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <button className='bg-red-500 p-4 text-white rounded-lg' onClick={() => onDeleteExercise(routineExercise.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                </button>
                            </div>

                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Set</th>
                                    <th className="border p-2 text-left">Peso sugerido</th>
                                    <th className="border p-2 text-left">Repeticiones sugeridas</th>
                                    <th className="border p-2 text-left">Tipo de peso</th>
                                    <th className="border p-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSets.map((set) => (
                                    <tr key={set.id} className="hover:bg-gray-50">
                                        <td className="border p-2">{set.set_number}</td>
                                        <td className="border p-2">{set.suggested_weight}</td>
                                        <td className="border p-2">{set.suggested_repetitions}</td>
                                        <td className="border p-2">{GetCompleteWeightType(routineExercise.weight_type_id)}</td>
                                        <td className="border p-2">
                                            <Dialog open={(editingSet?.id === set.id) || (isAddingNew && !set.id)}
                                                onOpenChange={(open) => {
                                                    if (!open) {
                                                        setEditingSet(null);
                                                        setIsAddingNew(false);
                                                    }
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="mr-2" onClick={() => { setEditingSet(set) }}>Editar</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Editar el set de ejercicio</DialogTitle>
                                                    </DialogHeader>
                                                    {editingSet && (
                                                        <ExerciseSetForm
                                                            onSubmit={(updatedSet: Omit<RoutineExerciseSet, "id">) => {
                                                                onUpdate({ ...updatedSet, id: set.id, routine_exercise_id: set.routine_exercise_id, set_number: set.set_number } as RoutineExerciseSet);
                                                                setEditingSet(null);
                                                            }}
                                                            initialValues={editingSet}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="destructive" onClick={() => {
                                                if (set.id) {
                                                    onDeleteSet(set.id)
                                                }
                                            }}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={5}>
                                        <Button className="w-full" onClick={() => onAdd(routineExercise.id)}>
                                            Agregar Set
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default ExerciseSetList;