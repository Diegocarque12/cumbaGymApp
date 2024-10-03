import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Exercise } from 'interfaces/types';

interface MyComponentProps {
    exercise: Exercise | null;
    onSubmit: (exercise: Exercise) => Promise<void>;
    onCancel: () => void;
}

const ExerciseForm = ({ exercise, onSubmit, onCancel }: MyComponentProps) => {
    const form = useForm<Exercise>({
        defaultValues: {
            name: exercise?.name || '',
            description: exercise?.description || '',
            category: exercise?.category || '',
            target_muscle: exercise?.target_muscle || '',
            equipment: exercise?.equipment || '',
            difficulty: exercise?.difficulty || '',
            instructions: exercise?.instructions || '',
            video_url: exercise?.video_url || '',
            image_url: exercise?.image_url || '',
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  bg-white p-6">
                <h2 className="text-lg font-medium text-gray-900">Crear Ejercicio</h2>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Nombre Del Ejercicio:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Descripción:</FormLabel>
                            <FormControl>
                                <textarea
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                ></textarea>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Categoría:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="target_muscle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Músculo objetivo:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="equipment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Equipo:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Dificultad:</FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                >
                                    <option value="">Selecciona una dificultad</option>
                                    <option value="principiante">Principiante</option>
                                    <option value="intermedio">Intermedio</option>
                                    <option value="avanzado">Avanzado</option>
                                </select>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">Instrucciones:</FormLabel>
                            <FormControl>
                                <textarea
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                ></textarea>
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="video_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">URL del video:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">URL de la imagen:</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500 text-xs mt-1" />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="outline" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancelar
                    </Button>
                    <Button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Guardar
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ExerciseForm;
