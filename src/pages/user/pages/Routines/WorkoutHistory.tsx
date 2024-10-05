import { Link } from "react-router-dom";

const WorkoutHistory = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Historial de Entrenamientos</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <p className="text-lg text-gray-600 text-center mb-6">Esta página está actualmente en construcción.</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-blue-600 h-2.5 rounded-full w-1/3"></div>
                </div>
                <Link to="user/dashboard" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform inline-block text-center">
                    Volver al Dashboard
                </Link>
            </div>
        </div>
    );
};

export default WorkoutHistory;
