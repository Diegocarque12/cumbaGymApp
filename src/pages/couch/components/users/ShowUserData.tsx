import supabase from "@/utils/supabaseClient";
import { Routine, User } from "interfaces/types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ShowUserData = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        fetchUserData();
        fetchUserRoutines();
        fetchAllRoutines();
    }, [userId]);

    const fetchUserData = async () => {
        if (userId) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();
            if (data) setUser(data);
            if (error) console.error('Error fetching user data:', error);
        }
    };

    const fetchUserRoutines = async () => {
        if (userId) {
            const { data, error } = await supabase
                .from("userroutines")
                .select("*, routines(*)")
                .eq("userId", userId);
            if (data) setUserRoutines(data.map((item) => item.routines) as Routine[]);
            if (error) console.error('Error fetching routines:', error);
        }
    };
    const fetchAllRoutines = async () => {
        if (userId) {
            const { data, error } = await supabase
                .from("routines")
                .select("*")
            if (data) setRoutines(data as Routine[]);
            if (error) console.error('Error fetching routines:', error);
        }
    };

    const updateUserData = async (updatedData: Partial<User>) => {
        if (userId) {
            const { error } = await supabase
                .from('users')
                .update(updatedData)
                .eq('id', userId);
            if (error) console.error('Error updating user data:', error);
            else fetchUserData();
        }
    };

    const addRoutine = async (newRoutine: Routine) => {
        console.log(newRoutine);

        const { error } = await supabase
            .from('userroutines')
            .insert({ routineid: newRoutine.id, userId: userId });
        if (error) console.error('Error adding routine:', error);
        else fetchUserRoutines();
    };

    const removeRoutine = async (routineId: string) => {
        console.log(routineId);

        const { error } = await supabase
            .from('userroutines')
            .delete()
            .eq('routineid', routineId);
        if (error) console.error('Error removing routine:', error);
        else fetchUserRoutines();
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
                                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">Identificación Nacional</label>
                                <input
                                    id="nationalId"
                                    type="text"
                                    value={user.nationalId}
                                    onChange={(e) => setUser({ ...user, nationalId: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
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
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={user.startDate ? new Date(user.startDate).toISOString().split('T')[0] : ''} onChange={(e) => setUser({ ...user, startDate: new Date(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género</label>
                                <input
                                    id="gender"
                                    type="text"
                                    value={user.gender}
                                    onChange={(e) => setUser({ ...user, gender: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                />
                            </div>
                            <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Guardar
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p><span className="font-semibold">Identificación Nacional:</span> {user.nationalId}</p>
                            <p><span className="font-semibold">Nombre:</span> {user.name}</p>
                            <p><span className="font-semibold">Apellido:</span> {user.lastName}</p>
                            <p><span className="font-semibold">Edad:</span> {user.age}</p>
                            <p className="capitalize"><span className="font-semibold">Objetivo:</span> {user.goal || 'No establecido'}</p>
                            <p><span className="font-semibold">Fecha de Inicio:</span> {new Date(user.startDate).toLocaleDateString()}</p>
                            <p className="capitalize"><span className="font-semibold ">Género:</span> {user.gender}</p>
                            <button onClick={() => setEditMode(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Editar
                            </button>
                        </div>
                    )}
                </div>
            )}
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Rutinas</h2>
                <div className="mt-6 mb-4 border-b border-gray-700 pb-6">
                    <label htmlFor="routineSelect" className="block text-sm font-medium text-gray-700">Agregar Rutina</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            placeholder="Buscar rutina..."
                            onChange={(e) => {
                                const searchTerm = e.target.value.toLowerCase()
                                const filteredRoutines = routines.filter(routine =>
                                    routine.name.toLowerCase().includes(searchTerm)
                                )
                                setFilteredRoutines(filteredRoutines)
                            }}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <ul className="mt-1 max-h-60 overflow-auto border border-gray-300 rounded-md">
                        {filteredRoutines.map((routine) => (
                            <li key={routine.id} className="flex justify-between items-center p-2 hover:bg-gray-100">
                                <span>{routine.name}</span>
                                <button
                                    onClick={() => addRoutine(routine)}
                                    className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Agregar
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>                                </button>
                            </li>
                        ))}

                    </ul>
                </div>
                <div className="space-y-4">
                    {userRoutines.map((routine) => (
                        <div key={routine.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                            <p className="text-lg font-medium">{routine.name}</p>
                            <button onClick={() => removeRoutine(routine.id.toString())} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Eliminar
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default ShowUserData;