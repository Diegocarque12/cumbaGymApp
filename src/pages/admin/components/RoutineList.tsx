import { useEffect, useState } from "react";
import supabase from "../../../utils/supabaseClient";
import type { Routine } from "../../../../interfaces/types";
import CreateRoutine from "./routine/CreateRoutine";
import { Link } from "react-router-dom";

const RoutineList = () => {
  const [routineList, setRoutinesList] = useState<Routine[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedRoutines, setSortedRoutines] = useState<Routine[]>([]);
  const [editingRoutine, setEditingRoutine] = useState<Routine>({
    id: 0,
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    try {
      const { data, error } = await supabase.from("routines").select("*").order('name', { ascending: true });
      if (error) {
        throw new Error(error.message);
      }
      setRoutinesList(data as Routine[]);
      setSortedRoutines(data as Routine[]);
    } catch (err) {
      setError("Error al obtener las rutinas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRoutine = (routine: Routine) => {
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
        const updatedRoutines = routineList.map((routine) =>
          routine.id === routine_id ? data[0] : routine
        );
        setRoutinesList(updatedRoutines);
        setSortedRoutines(updatedRoutines);
        setEditingRoutineId(null);
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
      const updatedRoutines = routineList.filter((routine) => routine.id !== routine_id);
      setRoutinesList(updatedRoutines);
      setSortedRoutines(updatedRoutines);
    } catch (err) {
      setError("Error al eliminar la rutina");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full mt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-8" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 md:py-12">
      <div className="mb-6 md:mb-12 text-right">
        <CreateRoutine updateRoutineList={fetchRoutines} />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar rutinas..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          onChange={(e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredRoutines = routineList.filter(
              (routine) =>
                routine.name.toLowerCase().includes(searchTerm) ||
                routine.description.toLowerCase().includes(searchTerm)
            );
            setSortedRoutines(filteredRoutines);
          }}
        />
      </div>
      <table className=" border-collapse w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 bg-gray-200 text-left">Nombre</th>
            <th className="px-4 py-2 bg-gray-200 text-left hidden md:block">Descripción</th>
            <th className="px-4 py-2 bg-gray-200 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedRoutines.map((routine) => (
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
              <td className="px-4 py-2 hidden md:block">
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
                <Link
                  to={`/admin/routines/${routine.id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-1 md:mr-2 inline-block align-sub md:align-baseline"
                >
                  <div className="flex items-center justify-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex justify-center items-center" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="hidden md:block">Ver Detalles</span>
                  </div>
                </Link>
                {editingRoutineId === routine.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateRoutine(routine.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-1 md:mr-2"
                    >
                      <div className="flex items-center justify-center gap-1">
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
                        <span className="hidden md:block">Guardar</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setEditingRoutineId(null)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      <div className="flex items-center justify-center gap-1">
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
                        <span className="hidden md:block">Cancelar</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditRoutine(routine)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-1 md:mr-2"
                    >
                      <div className="flex items-center justify-center gap-1">
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
                        <span className="hidden md:block">Editar</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <div className="flex items-center justify-center gap-1">
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
                        <span className="hidden md:block">Eliminar</span>
                      </div>
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};
export default RoutineList;