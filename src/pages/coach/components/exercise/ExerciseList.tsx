import { Exercise } from "interfaces/types";

interface ExerciseListProps {
    exercises: Exercise[];
    onView: (exercise: Exercise) => void;
    onEdit: (exercise: Exercise) => void;
    onDelete: (id: string) => void;
}

const ExerciseList = ({ exercises, onView }: ExerciseListProps) => {
    const sortedExercises = [...exercises].sort((a, b) => a.name.localeCompare(b.name));
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Nombre</th>
                    <th className="border p-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {sortedExercises.map((exercise) => (
                    <tr key={exercise.id} className="border-b">
                        <td className="border p-2 text-lg font-semibold">{exercise.name}</td>
                        <td className="border p-2">
                            <div className="flex justify-center space-x-2">
                                <button
                                    onClick={() => onView(exercise)}
                                    className="bg-blue-600 hover:bg-blue-700 w-auto flex items-center justify-center gap-4 text-white font-bold py-2 px-4 rounded transition duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden md:block">Detalles</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2} className="border p-2 text-center">
                        {exercises.length} Ejercicios
                    </td>
                </tr>
            </tfoot>
        </table>
    );
}

export default ExerciseList;
