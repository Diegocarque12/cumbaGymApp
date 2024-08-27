import { useEffect, useState } from "react";
import supabase from "../../../utils/supabaseClient";
import type { Routine } from "../../../../interfaces/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


const CreateRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<Routine>({
    id: 0,
    name: "",
    description: "",
  });
  const [editingRoutine, setEditingRoutine] = useState<Routine>({
    id: 0,
    name: "",
    description: "",
  });

  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const { data, error } = await supabase.from("routines").select("*");
      if (error) {
        throw new Error(error.message);
      }
      setRoutines(data as Routine[]);
    } catch (err) {
      setError("Error al obtener las rutinas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRoutine((prevRoutine) => ({
      ...prevRoutine,
      [name]: value,
    }));
  };

  const handleCreateRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from("routines")
        .insert([{ name: newRoutine.name, description: newRoutine.description }]);
      if (error) {
        throw new Error(error.message);
      }
      setRoutines((prevRoutines) => [...prevRoutines, ...(data ?? [])]);
      setNewRoutine({ id: 0, name: "", description: "" });
    } catch (err) {
      setError("Error al crear la rutina");
    }
  };

  const handleEditRoutine = (routine: Routine) => {
    setIsEditing(true);
    setEditingRoutineId(routine.id);
    setEditingRoutine(routine);
  };


  const handleUpdateRoutine = async (routine_id: number) => {
    try {
      const { data, error } = await supabase
        .from("routines")
        .update({ name: editingRoutine.name, description: editingRoutine.description })
        .eq("id", routine_id)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.length > 0) {
        setRoutines((prevRoutines) =>
          prevRoutines.map((routine) =>
            routine.id === routine_id ? data[0] : routine
          )
        );
        setNewRoutine({ id: 0, name: "", description: "" });
        setEditingRoutineId(null);
        setIsEditing(false);
      } else {
        throw new Error("No se recibieron datos actualizados");
      }
    } catch (err) {
      setError("Error al actualizar la rutina: " + (err as Error).message);
    }
  };



  const handleDeleteRoutine = async (routine_id: number) => {
    try {
      const { error } = await supabase.from("routines").delete().eq("id", routine_id);
      if (error) {
        throw new Error(error.message);
      }
      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine.id !== routine_id)
      );
    } catch (err) {
      setError("Error al eliminar la rutina");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mt-4 mx-12 container">
      <h1 className="text-2xl font-bold mb-4">Rutinas</h1>
      <table className=" border-collapse w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-left">Nombre</th>
            <th className="px-4 py-2 bg-gray-200 text-left">Descripción</th>
            <th className="px-4 py-2 bg-gray-200">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine) => (
            <tr key={routine?.id} className="border-t">
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editingRoutine.name}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, name: e.target.value })}
                    className=" px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  routine.name.length > 20 ? `${routine.name.slice(0, 20)}...` : routine.name
                )}
              </td>
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <input
                    type="text"
                    name="description"
                    value={editingRoutine.description}
                    onChange={(e) => setEditingRoutine({ ...editingRoutine, description: e.target.value })}
                    className=" px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  routine?.description?.length > 30 ? `${routine.description.slice(0, 30)}...` : routine?.description
                )}
              </td>
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateRoutine(routine.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                      <span className="hidden md:block">Guardar</span>
                      <span className="md:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                          />
                        </svg>
                      </span>
                    </button>
                    <button
                      onClick={() => setEditingRoutineId(null)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      <span className="hidden md:block">Cancelar</span>
                      <span className="md:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditRoutine(routine)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                    >
                      <span className="hidden md:block">Editar</span>
                      <span className="md:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >

                      <span className="hidden md:block">Eliminar</span>
                      <span className="md:hidden">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </span>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Crear una nueva rutina</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Rutina</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-2">Crear nueva rutina</h2>
            <div className="mb-6">
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Nombre de la rutina</label>
              <input
                type="text"
                name="name"
                value={newRoutine.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition duration-200 ease-in-out bg-gray-50"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                name="description"
                value={newRoutine.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition duration-200 ease-in-out bg-gray-50"
              />
            </div>
            <button
              type="button"
              disabled={isEditing}
              onClick={handleCreateRoutine}
              className="w-full px-6 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Crear
            </button>
          </div>
          <DialogFooter>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default CreateRoutine;
