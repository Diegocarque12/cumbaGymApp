import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExerciseSetForm from './ExerciseSetForm';
import { Exercise, RoutineExercise, RoutineExerciseSet } from "interfaces/types";

interface ExerciseSetListProps {
    routineExercises: RoutineExercise[];
    routineExerciseSets: RoutineExerciseSet[];
    exercises: Exercise[];
    onUpdate: (updatedSet: RoutineExerciseSet) => void;
    onDelete: (id: number) => void;
    onAdd: (routineExerciseId: number) => void;
    routine_id: number;
}

const ExerciseSetList = ({
    routineExercises,
    routineExerciseSets,
    exercises,
    onUpdate,
    onDelete,
    onAdd,
}: ExerciseSetListProps) => {
    const [editingSet, setEditingSet] = useState<RoutineExerciseSet | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        console.log("editingSet:", editingSet);
    }, [editingSet])

    return (
        <div>
            {routineExercises.map((routineExercise) => {
                const exercise = exercises.find(e => e.id === routineExercise.exercise_id);
                const sets = routineExerciseSets.filter(set => set.routine_exercise_id === routineExercise.id);

                return (
                    <div key={routineExercise.id} className="mb-6 border p-4 rounded-lg">
                        <h3 className="text-xl font-bold mb-2">{exercise?.name}</h3>
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
                                                    <Button variant="outline" className="mr-2" onClick={() => { setEditingSet(set); setIsEditing(true) }}>Edit</Button>
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
                                                            isEditing={isEditing}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                            <Button variant="destructive" onClick={() => {
                                                if (set.id) {
                                                    onDelete(set.id)
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
