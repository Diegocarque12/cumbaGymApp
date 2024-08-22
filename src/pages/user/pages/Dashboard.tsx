import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<{
        id: number;
        nationalid: string;
        name: string;
        lastname: string;
        age: number;
        goal: string;
        startDate: string;
        gender: string;
        role: string;
        user_id_auth: string;
    } | null>(null); const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!session) {
                    navigate("/login");
                    return;
                }
                const { data: userData, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("user_id_auth", session.user.id)
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
            <h1 className="text-3xl font-bold mb-8">Bienvenido, {user?.name}</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Información personal</h2>
                <p><strong>Nombre:</strong> {user?.name}</p>
                <p><strong>Apellido:</strong> {user?.lastname}</p>
                {/* <p><strong>Edad:</strong> {user?.age}</p>
                <p><strong>Género:</strong> {user?.gender}</p> */}
                <p><strong>Objetivo:</strong> {user?.goal}</p>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Acciones</h2>
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={() => navigate("/user/profile")}
                >
                    Editar perfil
                </button>
                {/* Agrega más botones o enlaces a otras secciones */}
            </div>
        </div>
    );
}

export default UserDashboard;
