import supabase from "@/utils/supabaseClient";
import { Exercise } from "interfaces/types";
import { useEffect, useState } from "react";
import ExerciseList from "../components/exercise/ExerciseList";
import ExerciseForm from "../components/exercise/ExerciseForm";
import ExerciseDetails from "../components/exercise/ExerciseDetails";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const Exercises = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isViewing, setIsViewing] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const handleCreate = () => {
        setSelectedExerciseId(null);
        setSelectedExercise(null);
        setIsEditing(true);
    };

    const handleEdit = (exercise: Exercise) => {
        setSelectedExerciseId(exercise.id);
        setSelectedExercise(exercise);
        setIsEditing(true);
    };

    const handleView = (exercise: Exercise) => {
        setSelectedExercise(exercise);
        setIsViewing(true);
    };

    const handleSubmit = async (exercise: Exercise) => {
        try {
            if (selectedExerciseId) {
                await updateExercise(exercise);
            } else {
                await createExercise(exercise);
            }
            setIsEditing(false);
            fetchExercises();
        } catch (error) {
            console.error('Failed to submit exercise:', error);
        }
    };

    const createExercise = async (exercise: Exercise) => {
        console.log('Creating exercise:', exercise);

        const { data, error } = await supabase.from('exercises').insert(exercise).select();
        if (error) throw error;
        if (!data) throw new Error('No data returned from insert operation');
        return data[0] as Exercise;
    };

    const updateExercise = async (exercise: Exercise) => {
        const { data, error } = await supabase
            .from('exercises')
            .update({ ...exercise, id: String(selectedExerciseId) })
            .eq('id', String(selectedExerciseId)).select();
        if (error) console.log(error);
        if (!data) throw new Error('No data returned from update operation');
        return data[0] as Exercise;
    };

    const handleDelete = async (id: string) => {
        try {
            const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este ejercicio?")
            if (confirmDelete) {
                await deleteExercise(id);
                fetchExercises();
            }
        } catch (error) {
            console.error('Failed to delete exercise:', error);
        }
    };

    const deleteExercise = async (id: string) => {
        const { error } = await supabase.from('exercises').delete().eq('id', id);
        if (error) throw error;
    };

    const fetchExercises = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.from('exercises').select('*');
            if (error) throw error;
            setExercises(data as Exercise[]);
        } catch (err) {
            setError('Failed to fetch exercises');
        } finally {
            setIsLoading(false);
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredExercises = exercises.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Ejercicios</h1>
            <div className="flex flex-col gap-4 md:flex-row md:gap-0 justify-between items-center mb-6">
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 w-full md:w-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>

                    Agregar Ejercicio
                </button>
                <input
                    type="text"
                    placeholder="Buscar ejercicio"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border w-full rounded py-2 px-3 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : (
                <ExerciseList
                    exercises={filteredExercises}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            {isEditing && (
                <Dialog open={isEditing} onOpenChange={(open) => setIsEditing(open)}>
                    <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen">
                        <DialogHeader>
                            <DialogTitle>Editar Ejercicio</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <ExerciseForm
                                exercise={selectedExercise}
                                onSubmit={handleSubmit}
                                onCancel={() => setIsEditing(false)}
                            />
                        </DialogDescription>
                    </DialogContent>
                </Dialog>)}
            {isViewing && selectedExercise && (
                <ExerciseDetails
                    exercise={selectedExercise}
                    onClose={() => setIsViewing(false)}
                    open={isViewing}
                />
            )}
        </div>
    );
};

export default Exercises;