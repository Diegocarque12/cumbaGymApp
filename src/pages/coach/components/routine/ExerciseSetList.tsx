import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExerciseSetForm from './ExerciseSetForm';
import { Exercise, RoutineExercise, RoutineExerciseSet } from "interfaces/types";

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
    const [editingSet, setEditingSet] = useState<RoutineExerciseSet | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);

    return (
        <div>
            {routineExercises.map((routineExercise) => {
                const exercise = exercises.find(e => e.id === routineExercise.exercise_id);
                const sets = routineExerciseSets.filter(set => set.routine_exercise_id === routineExercise.id);
                return (
                    <div key={routineExercise.id} className="mb-6 border p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold mb-2">{exercise?.name}</h3>
                            <button className='bg-red-500 p-4 text-white rounded-lg' onClick={() => onDeleteExercise(routineExercise.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>

                            </button>
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Set</th>
                                    <th className="border p-2 text-left">Suggested Weight</th>
                                    <th className="border p-2 text-left">Suggested Repetitions</th>
                                    <th className="border p-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sets.map((set) => (
                                    <tr key={set.id} className="hover:bg-gray-50">
                                        <td className="border p-2">{set.set_number}</td>
                                        <td className="border p-2">{set.suggested_weight}</td>
                                        <td className="border p-2">{set.suggested_repetitions}</td>
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
                                                    <Button variant="outline" className="mr-2" onClick={() => { setEditingSet(set) }}>Edit</Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Exercise Set</DialogTitle>
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
                                            }}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan={4}>
                                        <Button className="w-full" onClick={() => onAdd(routineExercise.id)}>
                                            Add Set
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
