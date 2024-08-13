import supabase from "@/utils/supabaseClient";
import { User } from "interfaces/types";
import { useState } from "react";

const NewUserForm = () => {
    const [newUser, setNewUser] = useState<User>({
        nationalId: "",
        name: "",
        lastName: "",
        age: 0,
        goal: "",
        startDate: new Date(),
        gender: "",
        isActive: true,
        role: "user",
    });
    const [error, setError] = useState<string | null>(null);

    const handleCreateUser = async () => {
        try {
            const { error } = await supabase.from("users").insert([newUser]);
            if (error) {
                console.log(error);

                throw new Error(error.message);
            }
            setNewUser({
                nationalId: "",
                name: "",
                lastName: "",
                age: 0,
                goal: "",
                startDate: new Date(),
                gender: "",
                isActive: true,
                role: "user",
            });
            setError(null);
            window.location.reload()

        } catch (err) {
            setError("Error al crear el user");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: name === "age" ? parseInt(value, 10) : value,
        }));
    };

    return (
        <div className="max-w-md mx-auto bg-white px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Nuevo Usuario</h2>
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div className="space-y-4">
                <div>
                    <label htmlFor="nationalId" className="block text-gray-700 text-sm font-bold mb-2">
                        Cédula:
                    </label>
                    <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        value={newUser.nationalId}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                        Apellido:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">
                        Edad:
                    </label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={newUser.age}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="goal" className="block text-gray-700 text-sm font-bold mb-2">
                        Objetivo:
                    </label>
                    <input
                        type="text"
                        id="goal"
                        name="goal"
                        value={newUser.goal}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
                        Género:
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={newUser.gender}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="">Seleccione un género</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="roles" className="block text-gray-700 text-sm font-bold mb-2">
                        Roles:
                    </label>
                    <select
                        id="roles"
                        name="roles"
                        value={newUser.role}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        multiple
                    >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="coach">Entrenador</option>
                    </select>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        onClick={handleCreateUser}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 mt-4"
                    >
                        Agregar Usuario
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewUserForm