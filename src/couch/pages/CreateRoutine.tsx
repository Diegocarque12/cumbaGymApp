import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";
import type { Routine } from "../../../interfaces/types";

const CreateRoutine = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [newRoutine, setNewRoutine] = useState<Routine>({
    id: 0,
    name: "",
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
      setNewRoutine({ id: 0, name: "" });
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
        .update({ name: newRoutine.name })
        .eq("id", routineId);
      if (error) {
        throw new Error(error.message);
      }
      setRoutines((prevRoutines) =>
        prevRoutines.map((routine) =>
          routine.id === routineId ? { ...routine, name: newRoutine.name } : routine
        )
      );
      setNewRoutine({ id: 0, name: "" });
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
    <div>
      <h1>Rutinas</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routines.map((routine) => (
            <tr key={routine.id}>
              <td>
                {editingRoutineId === routine.id ? (
                  <input
                    type="text"
                    name="name"
                    value={newRoutine.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  routine.name
                )}
              </td>
              <td>
                {editingRoutineId === routine.id ? (
                  <>
                    <button onClick={() => handleUpdateRoutine(routine.id)}>
                      Guardar
                    </button>
                    <button onClick={() => setEditingRoutineId(null)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditRoutine(routine)}>
                      Editar
                    </button>
                    <button onClick={() => handleDeleteRoutine(routine.id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Crear nueva rutina</h2>
        <input
          type="text"
          name="name"
          value={newRoutine.name}
          className="border-2 border-black"
          onChange={handleInputChange}
        />
        <button onClick={handleCreateRoutine}>Crear</button>
      </div>
    </div>
  );
};

export default CreateRoutine;
