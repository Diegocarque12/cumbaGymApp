
import { useState, useEffect } from "react";
import supabase from "@/utils/supabaseClient";
import { User } from "interfaces/types";

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('auth_id', user.id)
                .single();
            if (data) setUser(data);
            if (error) console.error('Error fetching user data:', error);
        }
    };

    const updateUserData = async (updatedData: Partial<User>) => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            const { error } = await supabase
                .from('profiles')
                .update(updatedData)
                .eq('auth_id', authUser.id);
            if (error) {
                console.error('Error updating user data:', error);
                setError("Error al actualizar los datos del usuario");
            } else {
                fetchUserData();
                setEditMode(false);
                setError(null);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => prevUser ? ({
            ...prevUser,
            [name]: name === "age" ? parseInt(value, 10) : value,
        }) : null);
    };

    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                {editMode ? (
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        updateUserData(user);
                    }} className="space-y-4">
                        <div>
                            <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">Identificación Nacional</label>
                            <input
                                id="national_id"
                                name="national_id"
                                type="text"
                                value={user.national_id}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                id="first_name"
                                name="first_name"
                                type="text"
                                value={user.first_name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input
                                id="last_name"
                                name="last_name"
                                type="text"
                                value={user.last_name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad</label>
                            <input
                                id="age"
                                name="age"
                                type="number"
                                value={user.age}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Objetivo</label>
                            <input
                                id="goal"
                                name="goal"
                                type="text"
                                value={user.goal || ''}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">Género:</label>
                            <select
                                id="gender"
                                name="gender"
                                value={user.gender}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Seleccione un género</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Guardar
                        </button>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p><span className="font-semibold">Identificación Nacional:</span> {user.national_id}</p>
                        <p><span className="font-semibold">Nombre:</span> {user.first_name}</p>
                        <p><span className="font-semibold">Apellido:</span> {user.last_name}</p>
                        <p><span className="font-semibold">Edad:</span> {user.age}</p>
                        <p className="capitalize"><span className="font-semibold">Objetivo:</span> {user.goal || 'No establecido'}</p>
                        <p><span className="font-semibold">Fecha de Inicio:</span> {new Date(user.start_date).toLocaleDateString()}</p>
                        <p className="capitalize"><span className="font-semibold">Género:</span> {user.gender}</p>
                        <button onClick={() => setEditMode(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Editar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
