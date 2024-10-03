import supabase from "@/utils/supabaseClient";
import { User } from "interfaces/types";
import React from "react";
import { useState } from "react";

const NewUserForm = () => {
    const [newUser, setNewUser] = useState<User>({
        national_id: "",
        first_name: "",
        last_name: "",
        age: 0,
        goal: "",
        start_date: new Date(),
        gender: "",
        is_active: true,
        role: "user",
    });
    const [error, setError] = useState<string | null>(null);

    const handleCreateUser = async () => {
        try {
            const { error } = await supabase.from("profiles").insert([newUser]);
            if (error) {
                console.error('Error in newUserForm', error);
                throw new Error(error.message);
            }
            setNewUser({
                national_id: "",
                first_name: "",
                last_name: "",
                age: 0,
                goal: "",
                start_date: new Date(),
                gender: "",
                is_active: true,
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
                    <label htmlFor="national_id" className="block text-gray-700 text-sm font-bold mb-2">
                        Cédula:
                    </label>
                    <input
                        type="text"
                        id="national_id"
                        name="national_id"
                        value={newUser.national_id}
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
                        value={newUser.first_name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label htmlFor="last_name" className="block text-gray-700 text-sm font-bold mb-2">
                        Apellido:
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={newUser.last_name}
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
                    <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                        Roles:
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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