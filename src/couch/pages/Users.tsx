import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";
import type { User, Routine, Measurement } from "../../../interfaces/types";

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userRoutines, setUserRoutines] = useState<Routine[]>([]);
    const [showAddUser, setShowAddUser] = useState(false);
    const [showAddMeasurement, setShowAddMeasurement] = useState(false);
    const [userMeasurements, setUserMeasurements] = useState<Measurement[]>([]);
    const [newUser, setNewUser] = useState<User>({
        id: 0,
        nationalId: "",
        name: "",
        lastName: "",
        age: 0,
        goal: "",
        startDate: new Date(),
        gender: "",
    });
    const [newMeasurement, setNewMeasurement] = useState<Measurement>({
        id: 0,
        userid: 0,
        leftArm: 0,
        rightArm: 0,
        upperWaist: 0,
        lowerWaist: 0,
        leftThigh: 0,
        rightThigh: 0,
        measurementDate: new Date(),
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from("users").select("*");
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

    const fetchUserRoutines = async (userId: number) => {
        try {
            const { data, error } = await supabase
                .from("userroutines")
                .select("*, routines(*)")
                .eq("userid", userId);
            if (error) {
                throw new Error(error.message);
            }
            setUserRoutines(data.map((item) => item.routines) as Routine[]);
        } catch (err) {
            setError("Error al obtener las rutinas del usuario");
        }
    };

    const fetchUserMeasurements = async (userId: number) => {
        try {
            const { data, error } = await supabase
                .from("measurements")
                .select("*")
                .eq("userid", userId);
            if (error) {
                throw new Error(error.message);
            }
            setUserMeasurements(data as Measurement[]);
        } catch (err) {
            setError("Error al obtener las medidas del usuario");
        }
    };

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        fetchUserRoutines(user.id);
        fetchUserMeasurements(user.id);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleMeasurementInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMeasurement((prevMeasurement) => ({
            ...prevMeasurement,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        try {
            const { data, error } = await supabase.from("users").insert([newUser]);
            if (error) {
                throw new Error(error.message);
            }
            setUsers((prevUsers) => [...prevUsers, ...(data ?? [])]);
            setNewUser({
                id: 0,
                nationalId: "",
                name: "",
                lastName: "",
                age: 0,
                goal: "",
                startDate: new Date(),
                gender: "",
            });
        } catch (err) {
            setError("Error al crear el usuario");
        }
    };

    const handleCreateMeasurement = async () => {
        try {
            const { data, error } = await supabase.from("measurements").insert([
                {
                    ...newMeasurement,
                    userId: selectedUser?.id,
                    measurementDate: new Date(), // Establecer la fecha actual
                },
            ]);
            if (error) {
                throw new Error(error.message);
            }
            setUserMeasurements((prevMeasurements) => [...prevMeasurements, ...(data ?? [])]);
            setNewMeasurement({
                id: 0,
                userid: 0,
                leftArm: 0,
                rightArm: 0,
                upperWaist: 0,
                lowerWaist: 0,
                leftThigh: 0,
                rightThigh: 0,
                measurementDate: new Date(),
            });
            setShowAddMeasurement(false); // Ocultar el formulario después de agregar la medida
        } catch (err) {
            setError("Error al crear la medida");
        }
    };

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Usuarios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>
                    <ul className="space-y-4">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="cursor-pointer hover:bg-gray-100 p-4 rounded"
                                onClick={() => handleUserClick(user)}
                            >
                                {user.name} {user.lastName}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    {selectedUser && (
                        <div>
                            <h2 className="text-xl font-bold mb-4">Detalles del Usuario</h2>
                            <p>
                                <strong>Nombre:</strong> {selectedUser.name} {selectedUser.lastName}
                            </p>
                            <p>
                                <strong>Edad:</strong> {selectedUser.age}
                            </p>
                            <p>
                                <strong>Género:</strong> {selectedUser.gender}
                            </p>
                            <p>
                                <strong>Objetivo:</strong> {selectedUser.goal}
                            </p>
                            <p>
                                <p>
                                    <strong>Fecha de Inicio:</strong>{" "}
                                    {selectedUser.startDate
                                        ? new Date(selectedUser.startDate).toLocaleDateString()
                                        : ""}
                                </p>
                            </p>
                            <h3 className="text-lg font-bold mt-8 mb-4">Rutinas del Usuario</h3>
                            <ul className="space-y-2">
                                {userRoutines.map((routine) => (
                                    <li key={routine.id}>{routine.name}</li>
                                ))}
                            </ul>
                            <h3 className="text-lg font-bold mt-8 mb-4">Medidas del Usuario</h3>
                            <ul className="space-y-2">
                                {userMeasurements.map((measurement) => (
                                    <li key={measurement.id}>
                                        <p>
                                            <strong>Fecha:</strong>{" "}
                                            {measurement.measurementDate
                                                ? new Date(measurement.measurementDate).toLocaleDateString()
                                                : ""}
                                        </p>
                                        <p>
                                            <strong>Brazo Izquierdo:</strong> {measurement.leftArm} cm
                                        </p>
                                        <p>
                                            <strong>Brazo Derecho:</strong> {measurement.rightArm} cm
                                        </p>
                                        <p>
                                            <strong>Cintura Superior:</strong> {measurement.upperWaist} cm
                                        </p>
                                        <p>
                                            <strong>Cintura Inferior:</strong> {measurement.lowerWaist} cm
                                        </p>
                                        <p>
                                            <strong>Muslo Izquierdo:</strong> {measurement.leftThigh} cm
                                        </p>
                                        <p>
                                            <strong>Muslo Derecho:</strong> {measurement.rightThigh}cm
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <h3 className="text-lg font-bold mt-8 mb-4">Agregar Medida</h3>

                            <div className="mt-8">
                                <button
                                    onClick={() => setShowAddMeasurement(!showAddMeasurement)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {showAddMeasurement ? "Ocultar" : "Agregar Medida"}
                                </button>
                                {showAddMeasurement && (
                                    <div className="mt-4 space-y-4">
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="leftArm" className="block mb-1">
                                                    Brazo Izquierdo:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="leftArm"
                                                    value={newMeasurement.leftArm}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="rightArm" className="block mb-1">
                                                    Brazo Derecho:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="rightArm"
                                                    value={newMeasurement.rightArm}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="upperWaist" className="block mb-1">
                                                    Cintura Superior:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="upperWaist"
                                                    value={newMeasurement.upperWaist}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="lowerWaist" className="block mb-1">
                                                    Cintura Inferior:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="lowerWaist"
                                                    value={newMeasurement.lowerWaist}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="leftThigh" className="block mb-1">
                                                    Muslo Izquierdo:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="leftThigh"
                                                    value={newMeasurement.leftThigh}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="rightThigh" className="block mb-1">
                                                    Muslo Derecho:
                                                </label>
                                                <input
                                                    type="number"
                                                    name="rightThigh"
                                                    value={newMeasurement.rightThigh}
                                                    onChange={handleMeasurementInputChange}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleCreateMeasurement}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Agregar Medida
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Agregar Usuario</h2>
                <button
                    onClick={() => setShowAddUser(!showAddUser)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {showAddUser ? "Ocultar" : "Agregar Usuario"}
                </button>
                {showAddUser && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="nationalId" className="block mb-1">
                                Cédula:
                            </label>
                            <input
                                type="text"
                                name="nationalId"
                                value={newUser.nationalId}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-1">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block mb-1">
                                Apellido:
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={newUser.lastName}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="age" className="block mb-1">
                                Edad:
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={newUser.age}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="goal" className="block mb-1">
                                Objetivo:
                            </label>
                            <input
                                type="text"
                                name="goal"
                                value={newUser.goal}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <div>
                            <label htmlFor="gender" className="block mb-1">
                                Género:
                            </label>
                            <input
                                type="text"
                                name="gender"
                                value={newUser.gender}
                                onChange={handleInputChange}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                        </div>
                        <button
                            onClick={handleCreateUser}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Agregar Usuario
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
