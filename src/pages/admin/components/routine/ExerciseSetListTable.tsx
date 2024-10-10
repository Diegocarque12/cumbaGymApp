import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react'
import ExerciseSetForm from './ExerciseSetForm';
import { RoutineExerciseSet } from 'interfaces/types';
import { GetCompleteWeightType } from '@/utils/WeightType';

interface ExerciseSetListTableProps {
    sortedSets: RoutineExerciseSet[],
    editingSet: RoutineExerciseSet | null,
    setEditingSet: React.Dispatch<React.SetStateAction<RoutineExerciseSet | null>>,
    isAddingNew: boolean,
    setIsAddingNew: React.Dispatch<React.SetStateAction<boolean>>,
    weightTypeId: number,
    routineExerciseId: number,
    onUpdate: (updatedSet: RoutineExerciseSet) => void;
    onDeleteSet: (id: number) => void;
    onAdd: (routineExerciseId: number) => void;
}

const ExerciseSetListTable = ({
    sortedSets,
    editingSet,
    setEditingSet,
    isAddingNew,
    setIsAddingNew,
    weightTypeId,
    routineExerciseId,
    onUpdate,
    onDeleteSet,
    onAdd
}: ExerciseSetListTableProps) => {
    return (
        <table className="w-full border-collapse hidden md:inline-table">
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
                        <td className="border p-2">{GetCompleteWeightType(weightTypeId)}</td>
                        <td className="border p-2">
                            <Dialog open={(editingSet?.id === set.id) || (isAddingNew && !set.id)}
                                onOpenChange={(open: boolean) => {
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
                        <Button className="w-full" onClick={() => onAdd(routineExerciseId)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                            </svg>
                            <span>Agregar Set</span>
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

export default ExerciseSetListTable
