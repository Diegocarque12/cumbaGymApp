import { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Exercise, RoutineExercise, RoutineExerciseSet, WeightTypes } from "interfaces/types";
import { GetCompleteWeightType } from '@/utils/WeightType';
import supabase from '@/utils/supabaseClient';
import ExerciseSetListTable from './ExerciseSetListTable';
import ExerciseSetListCard from './ExerciseSetListCard';

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

    const memoizedOnAdd = useCallback((routineExerciseId: number) => {
        onAdd(routineExerciseId);
    }, [onAdd]);

    const onUpdateWeightType = async (routineExerciseId: number, newWeightTypeId: number) => {
        setWeightType({
            id: newWeightTypeId,
            name: GetCompleteWeightType(newWeightTypeId),
        });
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
                                        <Button variant="secondary" className="mr-2 bg-blue-600 text-white hover:bg-blue-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                <path d="m536-84-56-56 142-142-340-340-142 142-56-56 56-58-56-56 84-84-56-58 56-56 58 56 84-84 56 56 58-56 56 56-142 142 340 340 142-142 56 56-56 58 56 56-84 84 56 58-56 56-58-56-84 84-56-56-58 56Z" />
                                            </svg>
                                            <span className='hidden md:block ml-2'>Cambiar Tipo de Peso</span>
                                        </Button>
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
                                <button className='bg-red-500 p-2 text-white rounded-lg' onClick={() => onDeleteExercise(routineExercise.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                        <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <ExerciseSetListTable sortedSets={sortedSets} editingSet={editingSet} setEditingSet={setEditingSet} isAddingNew={isAddingNew} setIsAddingNew={setIsAddingNew} weightTypeId={routineExercise.weight_type_id} routineExerciseId={routineExercise.id} onUpdate={onUpdate} onDeleteSet={onDeleteSet} onAdd={memoizedOnAdd} />
                        {/* TODO: Check why add many sets on only one click
                         */}
                        <ExerciseSetListCard sortedSets={sortedSets} editingSet={editingSet} setEditingSet={setEditingSet} isAddingNew={isAddingNew} setIsAddingNew={setIsAddingNew} weightTypeId={routineExercise.weight_type_id} routineExerciseId={routineExercise.id} onUpdate={onUpdate} onDeleteSet={onDeleteSet} onAdd={memoizedOnAdd} />
                    </div>
                );
            })}
        </div>
    );
};

export default ExerciseSetList;