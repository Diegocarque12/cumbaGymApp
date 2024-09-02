import { useState, useEffect } from "react";
import supabase from "../../../utils/supabaseClient";
import type { User } from "../../../../interfaces/types";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import MyTodayWorkout from "../components/workout/MyTodayWorkout";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TodayWorkout = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentScreen, setCurrentScreen] = useSessionStorage('currentScreen', 'myWorkout');
    const [users, setUsers] = useState<User[]>([]);
    const [unPinnedUsers, setUnPinnedUsers] = useState<User[]>([]);
    const [pinnedUsers, setPinnedUsers] = useState<User[]>([]);
    const [filtedUsers, setFiltedUsers] = useState<User[]>([]);



    // get all the users that are not deleted
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

    useEffect(() => {
        fetchUsers();
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
                <MyTodayWorkout userId={1} />
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
                        {pinnedUsers.length > 0 && pinnedUsers.map((user, index) => (
                            <Dialog key={index}>
                                <DialogTrigger asChild>
                                    <div key={user.id} className="mb-4 p-8 w-full sm:w-1/2 md:w-1/3 bg-gray-400 rounded-lg m-2 relative cursor-pointer hover:bg-gray-500">
                                        <button className="absolute top-2 right-2" onClick={(e) => { e.stopPropagation(); handleUnPinUser(user); }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-2 right-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-6.46 6.46a2 2 0 0 0 0 2.83L15 21" />
                                            </svg>
                                        </button>
                                        <div>
                                            <p className="text-lg font-semibold">{user.name}</p>
                                            <p className="text-gray-800">{user.last_name}</p>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] h-full overflow-y-scroll ">
                                    <DialogHeader className="h-auto">
                                        <DialogTitle>{user.name} {user.last_name}</DialogTitle>
                                        <DialogDescription>
                                            Información de rutinas
                                        </DialogDescription>
                                    </DialogHeader>
                                    <MyTodayWorkout userId={user.id || 0} />
                                </DialogContent>
                            </Dialog>
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
