import { Exercise } from "interfaces/types";

interface ExerciseListProps {
    exercises: Exercise[];
    onView: (exercise: Exercise) => void;
    onEdit: (exercise: Exercise) => void;
    onDelete: (id: string) => void;
}

const ExerciseList = ({ exercises, onView, onEdit, onDelete }: ExerciseListProps) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2 text-left">Nombre</th>
                    <th className="border p-2 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {exercises.map((exercise) => (
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
                                <button
                                    onClick={() => onEdit(exercise)}
                                    className="bg-green-600 hover:bg-green-700 w-auto flex items-center justify-center gap-4 text-white font-bold py-2 px-4 rounded transition duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    <span className="hidden md:block">Editar</span>
                                </button>
                                <button
                                    onClick={() => onDelete(exercise.id.toString())}
                                    className="bg-red-600 hover:bg-red-700 w-auto flex items-center justify-center gap-4 text-white font-bold py-2 px-4 rounded transition duration-300"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="hidden md:block">Eliminar</span>
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
                {/* <tr>
                    <td colSpan={2} className="border p-2">
                        <div className="flex justify-center items-center space-x-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l transition duration-300 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r transition duration-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </td>
                </tr> */}

            </tfoot>
        </table>
    );
}

export default ExerciseList;
