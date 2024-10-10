import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React, { useState } from 'react'
import ExerciseSetForm from './ExerciseSetForm';
import { RoutineExerciseSet } from 'interfaces/types';
import { GetCompleteWeightType } from '@/utils/WeightType';

interface ExerciseSetListCardProps {
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

const ExerciseSetListCard = ({
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
}: ExerciseSetListCardProps) => {
    const [isClicked, setIsClicked] = useState(false)
    return (
        <div className="space-y-4 md:hidden shadow-md">
            {sortedSets.map((set) => (
                <div key={set.id} className="bg-white shadow-sm rounded-lg p-4 mb-2">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">Set {set.set_number}</h3>
                        <div className="space-x-2">
                            <Dialog open={(editingSet?.id === set.id) || (isAddingNew && !set.id)}
                                onOpenChange={(open: boolean) => {
                                    if (!open) {
                                        setEditingSet(null);
                                        setIsAddingNew(false);
                                    }
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button variant="outline" onClick={() => { setEditingSet(set) }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#2664eb">
                                            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                        </svg>
                                    </Button>
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
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                    <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                                </svg>
                            </Button>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-4'>
                        <div className="bg-gray-100 p-3 rounded-lg col-span-2">
                            <p className="text-sm text-gray-600 font-semibold mb-1">Peso sugerido</p>
                            <p className="text-lg font-bold">{set.suggested_weight}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg col-span-2">
                            <p className="text-sm text-gray-600 font-semibold mb-1">Tipo de peso</p>
                            <p className="text-lg font-bold">{GetCompleteWeightType(weightTypeId)}</p>
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg col-span-4">
                            <p className="text-sm text-gray-600 font-semibold mb-1">Repeticiones Sugeridas</p>
                            <p className="text-lg font-bold">{set.suggested_repetitions}</p>
                        </div>
                    </div>
                </div>
            ))}
            <Button className={`w-full ${isClicked ?? 'bg-slate-400 cursor-not-allowed'}`} disabled={isClicked} onClick={() => {
                setIsClicked(true)
                onAdd(routineExerciseId)
                setTimeout(() => {
                    setIsClicked(false)
                }, 2000)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                </svg>
            </Button>
        </div>
    )
}

export default ExerciseSetListCard
