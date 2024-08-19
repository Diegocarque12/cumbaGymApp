import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ExerciseSetForm from './ExerciseSetForm';
import { Exercise, ExerciseSet } from "interfaces/types";
import { memo, useState } from "react";

interface ExerciseSetListProps {
    exerciseSets: ExerciseSet[];
    exercises: Exercise[];
    onUpdate: (updatedSet: ExerciseSet) => void;
    onDelete: (id: number) => void;
    routineId: number;
}

const ExerciseSetList = ({ exerciseSets, exercises, onUpdate, onDelete, routineId }: ExerciseSetListProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2">Ejercicio</th>
                    <th className="px-4 py-2">Serie</th>
                    <th className="px-4 py-2">Peso</th>
                    <th className="px-4 py-2">Repeticiones</th>
                    <th className="px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {exerciseSets.map((set) => (
                    <tr key={set.id} className="border-t">
                        <td className="px-4 py-2 text-center">{exercises.find(e => e.id === set.exerciseId)?.name}</td>
                        <td className="px-4 py-2 text-center">{set.setnumber}</td>
                        <td className="px-4 py-2 text-center">{set.weight}</td>
                        <td className="px-4 py-2 text-center">{set.repetitions}</td>
                        <td className="px-4 py-2 text-center">
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="mr-2">Editar</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Editar serie de ejercicio</DialogTitle>
                                    </DialogHeader>
                                    <ExerciseSetForm
                                        exercises={exercises}
                                        onSubmit={(updatedSet) => {
                                            onUpdate({ ...updatedSet, id: set.id })
                                            setIsDialogOpen(false);
                                        }}
                                        initialValues={set}
                                        routineId={routineId}
                                    />
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" onClick={() => onDelete(set.id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default memo(ExerciseSetList);