import { Exercise, RoutineExercise, RoutineExerciseSet } from "interfaces/types";
import { GetCompleteWeightType } from '@/utils/WeightType';

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
}: ExerciseSetListProps) => {

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
                        </div>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-left">Set</th>
                                    <th className="border p-2 text-left">Peso sugerido</th>
                                    <th className="border p-2 text-left">Repeticiones sugeridas</th>
                                    <th className="border p-2 text-left">Tipo de peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedSets.map((set) => (
                                    <tr key={set.id} className="hover:bg-gray-50">
                                        <td className="border p-2">{set.set_number}</td>
                                        <td className="border p-2">{set.suggested_weight}</td>
                                        <td className="border p-2">{set.suggested_repetitions}</td>
                                        <td className="border p-2">{GetCompleteWeightType(routineExercise.weight_type_id)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
};

export default ExerciseSetList;