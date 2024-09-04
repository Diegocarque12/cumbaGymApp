import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Exercise } from 'interfaces/types';

interface ExerciseDetailsProps {
    exercise: Exercise;
    onClose: () => void;
    open: boolean;
}

const ExerciseDetails = ({ exercise, onClose, open }: ExerciseDetailsProps) => {
    const getVideoEmbedUrl = (videoUrl: string): string | undefined => {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})/;
        const tiktokRegex = /(?:https?:\/\/)?(?:(?:www|vm)\.)?(?:tiktok\.com)\/(?:(@[\w.-]+\/video\/(\d+))|([A-Za-z0-9]+))/;

        const youtubeMatch = videoUrl.match(youtubeRegex);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        const tiktokMatch = videoUrl.match(tiktokRegex);
        if (tiktokMatch) {
            const videoId = tiktokMatch[2] || tiktokMatch[3];
            return `https://www.tiktok.com/embed/v2/${videoId}`;
        }

        return undefined;
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>Detalles del Ejercicio</DialogTitle>
            </DialogHeader>
            <DialogContent className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6 h-full overflow-y-auto">
                <DialogDescription>
                </DialogDescription>
                <span className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Detalles del Ejercicio</span>
                <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-gray-50 rounded-lg shadow-inner">
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Nombre:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.name}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Descripción:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.description}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Categoría:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.category}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Músculo objetivo:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.target_muscle}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Equipo:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.equipment}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start sm:items-center">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Dificultad:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.difficulty}</span>
                    </div>
                    <div className="text-base sm:text-lg flex flex-col sm:flex-row items-start">
                        <strong className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">Instrucciones:</strong>
                        <span className="text-gray-600 w-full sm:w-2/3">{exercise.instructions}</span>
                    </div>
                    {exercise.video_url && (
                        <div className="mt-6 sm:mt-8 bg-white p-4 rounded-lg shadow-md">
                            <span className="text-lg sm:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Video demostrativo</span>
                            <iframe
                                src={getVideoEmbedUrl(exercise.video_url)}
                                title="Video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full aspect-video rounded-lg shadow-sm mt-2"
                            ></iframe>
                        </div>
                    )}
                    {exercise.image_url && (
                        <div className="mt-6 sm:mt-8 bg-white p-4 rounded-lg shadow-md">
                            <span className="text-lg sm:text-xl font-bold mb-4 text-gray-800 border-b pb-2">Imagen ilustrativa</span>
                            <img src={exercise.image_url} alt={exercise.name} className="w-full rounded-lg shadow-sm" />
                        </div>
                    )}
                </div>
                <DialogTrigger asChild>
                    <button
                        onClick={onClose}
                        className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Cerrar
                    </button>
                </DialogTrigger>
            </DialogContent>
        </Dialog >
    );
}
export default ExerciseDetails;