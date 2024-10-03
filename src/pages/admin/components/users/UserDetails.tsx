import supabase from "@/utils/supabaseClient";
import { User } from "interfaces/types";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const UserDetails = () => {
    const { user_id } = useParams<{ user_id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        fetchUserData();
        // fetchUserRoutines();
        // fetchAllRoutines();
    }, [user_id]);

    const fetchUserData = async () => {
        if (user_id) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user_id)
                .single();
            if (data) setUser(data);
            if (error) console.error('Error fetching user data:', error);
        }
    };

    // const fetchUserRoutines = async () => {
    //     if (user_id) {
    //         const { data, error } = await supabase
    //             .from("profile_routines")
    //             .select("*, routines(*)")
    //             .eq("user_id", user_id);
    //         if (data) setUserRoutines(data.map((item) => item.routines) as Routine[]);
    //         if (error) console.error('Error fetching routines:', error);
    //     }
    // };
    // const fetchAllRoutines = async () => {
    //     if (user_id) {
    //         const { data, error } = await supabase
    //             .from("routines")
    //             .select("*")
    //         if (data) setRoutines(data as Routine[]);
    //         if (error) console.error('Error fetching routines:', error);
    //     }
    // };

    const updateUserData = async (updatedData: Partial<User>) => {
        if (user_id) {
            const { error } = await supabase
                .from('profiles')
                .update(updatedData)
                .eq('id', user_id);
            if (error) console.error('Error updating user data:', error);
            else fetchUserData();
        }
    };

    const handleDeactivateUser = async () => {
        if (user_id) {
            const { error } = await supabase
                .from('profiles')
                .update({ is_active: false })
                .eq('id', user_id);
            if (error) console.error('Error deactivating user:', error);
            else {
                navigate('/admin/users')
            }
        }
    };

    const handleDeleteUser = async () => {
        if (user_id) {
            const { error } = await supabase
                .from('profiles')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', user_id);
            if (error) console.error('Error deleting user:', error);
            else {
                navigate('/admin/users')
            }
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            {user && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Información de Usuario</h2>
                    {editMode ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            updateUserData(user);
                            setEditMode(false);
                        }} className="space-y-4">

                            <div>
                                <label htmlFor="national_id" className="block text-sm font-medium text-gray-700">Identificación Nacional</label>
                                <input
                                    id="national_id"
                                    type="text"
                                    value={user.national_id}
                                    onChange={(e) => setUser({ ...user, national_id: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={user.first_name}
                                    onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input
                                    id="last_name"
                                    type="text"
                                    value={user.last_name}
                                    onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Edad</label>
                                <input
                                    id="age"
                                    type="number"
                                    value={user.age}
                                    onChange={(e) => setUser({ ...user, age: Number(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="goal" className="block text-sm font-medium text-gray-700">Objetivo</label>
                                <input
                                    id="goal"
                                    type="text"
                                    value={user.goal || ''}
                                    onChange={(e) => setUser({ ...user, goal: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={user.start_date ? new Date(user.start_date).toISOString().split('T')[0] : ''} onChange={(e) => setUser({ ...user, start_date: new Date(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                                    Género:
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={user.gender}
                                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Seleccione un género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="rol" className="block text-gray-700 text-sm font-bold mb-2">
                                    Rol:
                                </label>
                                <select
                                    id="rol"
                                    name="rol"
                                    value={user.role}
                                    onChange={(e) => setUser({ ...user, role: e.target.value as "user" | "admin" | "coach" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Seleccione un rol</option>
                                    <option value="coach">Entrenador</option>
                                    <option value="usuario">Usuario</option>
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
                            <p className="capitalize"><span className="font-semibold ">Género:</span> {user.gender}</p>
                            <p className="capitalize"><span className="font-semibold">Rol de Usuario:</span> {user.role}</p>
                            <div className="flex justify-between">
                                <button onClick={() => setEditMode(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Editar
                                </button>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-600 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                                </svg>
                                                Desactivar Usuario
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>¿Estás seguro de que quieres desactivar este usuario?</DialogTitle>
                                                <DialogDescription>
                                                    El usuario será desactivado y no aparecerá en otras pantallas, solo en la de usuarios.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <button className="px-4 py-2 rounded">Cancelar</button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleDeactivateUser}>Desactivar</button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                Eliminar Usuario
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>¿Estás seguro de que quieres eliminar este usuario?</DialogTitle>
                                                <DialogDescription>
                                                    Esta acción no se puede deshacer. El usuario será marcado como eliminado en la base de datos.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <button className="px-4 py-2 rounded">Cancelar</button>
                                                </DialogClose>
                                                <DialogClose asChild>
                                                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteUser}>Eliminar</button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserDetails;