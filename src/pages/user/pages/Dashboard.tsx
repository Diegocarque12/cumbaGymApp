import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import { User } from "interfaces/types";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null); const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    navigate("/login");
                    return;
                }
                const { data: userData, error: userError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("auth_id", session.user.id)
                    .single();

                if (userError) {
                    throw new Error(userError.message);
                }
                setUser(userData);
            } catch (err) {
                console.error("Error al obtener los datos del usuario");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // if (error) {
    //     return <div>{error}</div>;
    // }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 container">
            <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">Bienvenido, {user?.first_name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Información personal</h2>
                    <div className="space-y-2">
                        <p><strong>Nombre completo:</strong> {user?.first_name} {user?.last_name}</p>
                        <p><strong>Edad:</strong> {user?.age}</p>
                        <p><strong>Género:</strong> {user?.gender}</p>
                        <p><strong>Objetivo:</strong> {user?.goal || 'No especificado'}</p>
                        <p><strong>Fecha de inicio:</strong> {user?.start_date ? new Date(user.start_date).toLocaleDateString() : 'No especificada'}</p>
                        <p><strong>Estado:</strong> {user?.is_active ? 'Activo' : 'Inactivo'}</p>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Acciones rápidas</h2>
                    <div className="flex flex-col space-y-4">
                        <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => navigate("/user/profile")}
                        >
                            Editar perfil
                        </button>
                        <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => navigate("/user/routines")}
                        >
                            Ver rutinas
                        </button>
                        <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => navigate("/user/measurements")}
                        >
                            Ver medidas
                        </button>
                        <button
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-300"
                            onClick={() => navigate("/user/workout-history")}
                        >
                            Historial de entrenamientos
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Resumen de actividad</h2>
                <p className="text-gray-600">Estamos trabajando en esta sección. Pronto podrás ver un resumen de tu actividad reciente, incluyendo tus últimos entrenamientos y progreso en rutinas.</p>
            </div>
        </div>
    );
}

export default UserDashboard;
