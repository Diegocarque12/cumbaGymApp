import supabase from "@/utils/supabaseClient";
import { Routine } from "interfaces/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserRoutinesDetails = () => {
    const { user_id } = useParams<{ user_id: string }>();
    const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        fetchUserRoutines();
        fetchAllRoutines();
    }, [user_id]);

    const fetchUserRoutines = async () => {
        if (user_id) {
            const { data, error } = await supabase
                .from("user_routines")
                .select("*, routines(*)")
                .eq("user_id", user_id);
            if (data) setUserRoutines(data.map((item) => item.routines) as Routine[]);
            if (error) console.error('Error fetching routines:', error);
        }
    };

    const fetchAllRoutines = async () => {
        if (user_id) {
            const { data, error } = await supabase
                .from("routines")
                .select("*")
            if (data) setRoutines(data as Routine[]);
            if (error) console.error('Error fetching routines:', error);
        }
    };

    const addRoutine = async (newRoutine: Routine) => {
        const { error } = await supabase
            .from('user_routines')
            .insert({ routine_id: newRoutine.id, user_id: user_id });
        if (error) console.error('Error adding routine:', error);
        else fetchUserRoutines();
    };

    const removeRoutine = async (routine_id: string) => {
        const { error } = await supabase
            .from('user_routines')
            .delete()
            .eq('routine_id', routine_id)
            .eq('user_id', user_id);
        if (error) console.error('Error removing routine:', error);
        else fetchUserRoutines();
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 container">
            <h2 className="text-2xl font-bold mb-4">Actuales rutinas del usuario</h2>
            <div className="space-y-4 border-b border-gray-700 pb-6">
                {userRoutines.map((routine) => (
                    <div key={routine.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                        <p className="text-lg font-medium">{routine.name}</p>
                        <button onClick={() => removeRoutine(routine.id.toString())} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 mb-4">
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
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Agregar
                            </button>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    )
}

export default UserRoutinesDetails
