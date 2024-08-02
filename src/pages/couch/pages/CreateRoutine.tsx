import { useEffect, useState } from "react";
import supabase from "../../../utils/supabaseClient";
import type { Routine } from "../../../../interfaces/types";

const CreateRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<Routine>({
    id: 0,
    name: "",
    description: "",
  });
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        .insert([{ name: newRoutine.name }]);
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
    setEditingRoutineId(routine.id);
    setNewRoutine(routine);
  };

  const handleUpdateRoutine = async (routineId: number) => {
    try {
      const { error } = await supabase
        .from("routines")
        .update({ name: newRoutine.name, description: newRoutine.description })
        .eq("id", routineId);
      if (error) {
        throw new Error(error.message);
      }
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine.id === routineId ? { ...routine, name: newRoutine.name } : routine
        )
      );
      setNewRoutine({ id: 0, name: "", description: "" });
      setEditingRoutineId(null);
    } catch (err) {
      setError("Error al actualizar la rutina");
    }
  };

  const handleDeleteRoutine = async (routineId: number) => {
    try {
      const { error } = await supabase.from("routines").delete().eq("id", routineId);
      if (error) {
        throw new Error(error.message);
      }
      setRoutines((prevRoutines) =>
        prevRoutines.filter((routine) => routine.id !== routineId)
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
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rutinas</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-left">Nombre</th>
            <th className="px-4 py-2 bg-gray-200 text-left">Descripción</th>
            <th className="px-4 py-2 bg-gray-200">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine) => (
            <tr key={routine.id} className="border-t">
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <input
                    type="text"
                    name="name"
                    value={newRoutine.name}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  routine.name
                )}
              </td>
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <input
                    type="text"
                    name="description"
                    value={newRoutine.description}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  routine.description
                )}
              </td>
              <td className="px-4 py-2">
                {editingRoutineId === routine.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateRoutine(routine.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingRoutineId(null)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditRoutine(routine)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Crear nueva rutina</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">Nombre de la rutina</label>
          <input
            type="text"
            name="name"
            value={newRoutine.name}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1">Descripción</label>
          <input
            type="text"
            name="description"
            value={newRoutine.description}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleCreateRoutine}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear
        </button>
      </div>
    </div>
  );
};

export default CreateRoutine;
