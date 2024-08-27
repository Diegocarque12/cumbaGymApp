import { useState, useEffect } from "react";
import supabase from "../../../utils/supabaseClient";
import type { Routine, User } from "../../../../interfaces/types";
import { useSessionStorage } from "@/hooks/useSessionStorage";

const TodayWorkout = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
    const [completedSets, setCompletedSets] = useState<boolean[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRoutineSelected, setIsRoutineSelected] = useState(false);
    const [currentScreen, setCurrentScreen] = useSessionStorage('currentScreen', 'myWorkout');
    const [users, setUsers] = useState<User[]>([]);
    const [unPinnedUsers, setUnPinnedUsers] = useState<User[]>([]);
    const [pinnedUsers, setPinnedUsers] = useState<User[]>([]);
    const [filtedUsers, setFiltedUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchRoutines();
        fetchUsers();
        console.log(completedSets);

    }, []);

    useEffect(() => {
        handleUnPinnedUsers();
    }, [users, pinnedUsers])

    useEffect(() => {
        const storedPinnedUsers = sessionStorage.getItem('pinnedUsers')
        if (storedPinnedUsers) {
            setPinnedUsers(JSON.parse(storedPinnedUsers))
        } else {
            sessionStorage.setItem('pinnedUsers', JSON.stringify(pinnedUsers))
        }
    }, [])

    /**
     * Fetches routines from the database and updates the state.
     * If an error occurs, it sets an error message.
     */
    const fetchRoutines = async () => {
        try {
            const { data: routinesData, error: routinesError } = await supabase.from("routines").select("*");

            if (routinesError) {
                throw new Error(routinesError.message);
            }
            setRoutines(routinesData as Routine[]);
        } catch (err) {
            setError("Error al obtener las rutinas");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetches non-deleted users from the database and updates the state.
     * If an error occurs, it sets an error message.
     */
    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .is("deleted_at", null)
                .order("name", { ascending: true });
            if (error) {
                throw new Error(error.message);
            }
            setUsers(data as User[]);
        } catch (err) {
            setError("Error al obtener los usuarios");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetches exercise sets for a given routine ID, including exercise names.
     * Updates the state with the fetched data and initializes completion status.
     * @param routine_id - The ID of the routine to fetch exercise sets for.
     */
    const fetchExerciseSets = async (routine_id: number) => {
        try {
            const { data: routineExercisesData, error: exerciseSetsError } = await supabase
                .from("routine_exercises")
                .select("*")
                .eq("routine_id", routine_id);

            if (exerciseSetsError) {
                throw new Error(exerciseSetsError.message);
            }

            const exerciseSetsWithNames = await Promise.all(
                routineExercisesData.map(async (exerciseSet) => {
                    const exercise_name = await getExerciseName(exerciseSet.exercise_id);
                    return { ...exerciseSet, exercise_name };
                })
            );

            setCompletedSets(new Array(exerciseSetsWithNames.length).fill(false));
        } catch (error) {
            console.error("Error al obtener los sets de ejercicios:", error);
        }
    };

    /**
     * Retrieves the name of an exercise by its ID from the database.
     * @param exercise_id - The ID of the exercise to fetch the name for.
     * @returns The name of the exercise or an empty string if an error occurs.
     */
    const getExerciseName = async (exercise_id: number) => {
        try {
            const { data, error } = await supabase
                .from("exercises")
                .select("name")
                .eq("id", exercise_id)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data.name;
        } catch (error) {
            console.error("Error al obtener el nombre del ejercicio:", error);
            return "";
        }
    };

    /**
     * Handles the change of selected routine.
     * Fetches exercise sets for the selected routine and updates the state.
     * @param event - The change event from the routine select element.
     */
    const handleRoutineChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const routine_id = parseInt(event.target.value);
        setSelectedRoutineId(routine_id);
        await fetchExerciseSets(routine_id);
        setIsRoutineSelected(true);
    };

    /**
     * Updates the completion status of a specific exercise set.
     * @param index - The index of the exercise set to update.
     * @param completed - The new completion status.
     */
    // const handleSetCompletion = (index: number, completed: boolean) => {
    //     const updatedCompletedSets = [...completedSets];
    //     updatedCompletedSets[index] = completed;
    //     setCompletedSets(updatedCompletedSets);
    // };


    /**
     * Resets the state when finishing a routine.
     */
    // const handleFinishRoutine = async () => {
    //     setSelectedRoutineId(null);
    //     setCompletedSets([]);
    //     setIsRoutineSelected(false);
    // };

    /**
     * Updates the list of unpinned users based on the current users and pinned users.
     */
    const handleUnPinnedUsers = () => {
        const newUnPinnedUsers = users.filter(user => !pinnedUsers.some(pinnedUser => pinnedUser.id === user.id));
        if (JSON.stringify(newUnPinnedUsers) !== JSON.stringify(unPinnedUsers)) {
            setUnPinnedUsers(newUnPinnedUsers);
        }
    }

    /**
     * Moves a user from the unpinned list to the pinned list.
     * @param user - The user to pin.
     */
    const handlePinUser = (user: User) => {
        setPinnedUsers([...pinnedUsers, user]);
        setUnPinnedUsers(unPinnedUsers.filter((u) => u.id !== user.id));
        setFiltedUsers(filtedUsers.filter((u) => u.id !== user.id));
        // Update pinnedUsers in sessionStorage
        const storedPinnedUsers = JSON.parse(sessionStorage.getItem('pinnedUsers') || '[]')
        const updatedPinnedUsers = [...storedPinnedUsers, user]
        sessionStorage.setItem('pinnedUsers', JSON.stringify(updatedPinnedUsers))


    }

    /**
     * Moves a user from the pinned list to the unpinned list.
     * @param user - The user to unpin.
     */
    const handleUnPinUser = (user: User) => {
        setPinnedUsers(pinnedUsers.filter((u) => u.id !== user.id));
        setUnPinnedUsers([...unPinnedUsers, user]);
        // Update pinned users in sessionStorage
        const storedPinnedUsers = JSON.parse(sessionStorage.getItem('pinnedUsers') || '[]')
        const updatedPinnedUsers = storedPinnedUsers.filter((u: User) => u.id !== user.id)
        sessionStorage.setItem('pinnedUsers', JSON.stringify(updatedPinnedUsers))

    }

    /**
     * Reloads the user list and updates the unpinned users if changes are detected.
     * I create a reload button because we will work with session storage and we need to update the list of users.
     */
    const handleReloadUsers = async () => {
        await fetchUsers();
    };

    const handleSearchName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = unPinnedUsers.filter((user) =>
            user.name.toLowerCase().includes(searchTerm) || user.last_name.toLowerCase().includes(searchTerm)
        );
        setFiltedUsers(filteredUsers);
    }

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container">
            <div className="flex flex-col items-center mb-4">
                <label htmlFor="screenSwitch" className="mr-3">Cambiar pantalla:</label>
                <div className="flex items-center space-x-4">
                    <span className="mr-3">Mi Entrenamiento</span>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={currentScreen === "myWorkout"}
                                onChange={() => setCurrentScreen(currentScreen === "myWorkout" ? "presentUsers" : "myWorkout")}
                            />
                            <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                            <div className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${currentScreen === "presentUsers" ? "transform translate-x-full bg-blue-600" : ""}`}></div>
                        </div>
                    </label>
                    <span className="ml-3">Usuarios Presentes</span>
                </div>
            </div>
            {currentScreen === "myWorkout" && (
                <>
                    <h2 className="text-2xl font-bold">Rutina del día</h2>
                    {!isRoutineSelected && (
                        <div className="mb-4">
                            <select
                                className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedRoutineId || ""}
                                onChange={handleRoutineChange}
                            >
                                <option value="">Seleccionar rutina</option>
                                {routines.map((routine) => (
                                    <option key={routine.id} value={routine.id}>
                                        {routine.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {/* {exerciseSets.length > 0 && isRoutineSelected && (
                        <>
                            <div className="flex items-center mb-4 justify-between">

                                <h2 className="text-xl font-semibold mb-4">{routines.find(routine => routine.id === selectedRoutineId)?.name}</h2>
                                {isRoutineSelected && (
                                    <button
                                        onClick={() => setIsRoutineSelected(!isRoutineSelected)}
                                        className="ml-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Lista de Ejercicios</h3>
                            {exerciseSets.map((exerciseSet, exerciseIndex) => (
                                <div key={exerciseSet.id} className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">Ejercicio: {exerciseSet.exercise_name}</h3>
                                    {Array.from({ length: exerciseSet.setnumber }).map((_, setIndex) => (
                                        <div key={`${exerciseSet.id}-${setIndex}`} className="bg-gray-100 p-4 rounded-lg mb-4">
                                            <p className="text-lg font-medium mb-2">Set: {setIndex + 1}</p>
                                            <div className="flex justify-between mb-2">
                                                <div>
                                                    <label htmlFor={`weight-${exerciseIndex}-${setIndex}`} className="mr-2">
                                                        Peso:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`weight-${exerciseIndex}-${setIndex}`}
                                                        className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={exerciseSet.weight}
                                                        onChange={(e) =>
                                                            handleWeightChange(exerciseIndex, parseInt(e.target.value))
                                                        }
                                                        disabled={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex]}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor={`repetitions-${exerciseIndex}-${setIndex}`} className="mr-2">
                                                        Repeticiones:
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id={`repetitions-${exerciseIndex}-${setIndex}`}
                                                        className="w-20 px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        value={exerciseSet.repetitions}
                                                        onChange={(e) =>
                                                            handleRepetitionsChange(exerciseIndex, parseInt(e.target.value))
                                                        }
                                                        disabled={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex]}
                                                    />
                                                </div>
                                            </div>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                    checked={completedSets[exerciseIndex * exerciseSet.setnumber + setIndex] || false}
                                                    onChange={(e) =>
                                                        handleSetCompletion(
                                                            exerciseIndex * exerciseSet.setnumber + setIndex,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                                <span className="ml-2">Completado</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <button
                                className="block w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={handleFinishRoutine}
                            >
                                Terminar rutina
                            </button>
                        </>
                    )}
                    {
                        exerciseSets.length === 0 && isRoutineSelected && (
                            <>
                                <div className="mb-4">
                                    <select
                                        className="block w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={selectedRoutineId || ""}
                                        onChange={handleRoutineChange}
                                    >
                                        <option value="">Seleccionar rutina</option>
                                        {routines.map((routine) => (
                                            <option key={routine.id} value={routine.id}>
                                                {routine.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-semibold mb-2">No hay ejercicios para esta rutina.</p>
                                </div>
                            </>
                        )
                    } */}
                </>
            )}
            {currentScreen === "presentUsers" && (
                <div className="flex flex-col">
                    <div className="flex flex-col-reverse justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold mt-4">Usuarios Presentes</h2>
                        <button className="bg-slate-400 p-2 rounded-lg hover:bg-slate-500" onClick={handleReloadUsers}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refrescar
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-center">
                        {pinnedUsers.length == 0 && (
                            <div className="my-8 text-center">
                                <span>¡Aún no hay usuarios fijados!</span>
                            </div>
                        )}
                        {pinnedUsers.length > 0 && pinnedUsers.map((user) => (
                            <div key={user.id} className="mb-8 p-8 w-full sm:w-1/2 md:w-1/3 bg-gray-300 rounded-lg m-2 relative ">
                                <button className="absolute top-2 right-2" onClick={() => handleUnPinUser(user)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-2 right-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-6.46 6.46a2 2 0 0 0 0 2.83L15 21" />
                                    </svg>
                                </button>
                                <div>
                                    <p className="text-lg font-semibold">{user.name}</p>
                                    <p className="text-gray-600">{user.last_name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap justify-center pt-8 border-t-2 border-gray-300 pb-4 ">
                        <h2 className="text-2xl font-bold mb-4">Todos Los Usuarios</h2>
                        <div className="mb-4 w-full">
                            <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => {
                                    handleSearchName(e);
                                }}
                            />
                        </div>
                        {filtedUsers.length > 0 && filtedUsers.map((user) => (
                            <div key={user.id} className="mb-4 p-8 w-full sm:w-1/2 md:w-1/3 bg-gray-300 rounded-lg m-2 relative">
                                <button className="absolute top-2 right-2" onClick={() => handlePinUser(user)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-2 right-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>

                                <div>
                                    <p className="text-lg font-semibold">{user.name}</p>
                                    <p className="text-gray-600">{user.last_name}</p>
                                </div>
                            </div>
                        ))}
                        {filtedUsers.length === 0 && unPinnedUsers.map((user) => (
                            <div key={user.id} className="mb-4 p-8 w-full sm:w-1/2 md:w-1/3 bg-gray-300 rounded-lg m-2 relative">
                                <button className="absolute top-2 right-2" onClick={() => handlePinUser(user)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-2 right-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </button>

                                <div>
                                    <p className="text-lg font-semibold">{user.name}</p>
                                    <p className="text-gray-600">{user.last_name}</p>
                                </div>
                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div >
    );
};

export default TodayWorkout;
