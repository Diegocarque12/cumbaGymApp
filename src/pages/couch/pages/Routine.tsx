import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import type { Exercise, ExerciseSet, Routine } from "../../../../interfaces/types";

const Routine = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const routineid = parseInt(routineId || "0");
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseSet, setNewExerciseSet] = useState<ExerciseSet>({
    id: 0,
    routineId: routineid,
    exerciseId: 0,
    setnumber: 0,
    weight: 0,
    repetitions: 0,
  });
  const [editingExerciseSetId, setEditingExerciseSetId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');


  useEffect(() => {
    fetchRoutine();
    fetchExerciseSets();
    fetchExercises();
    fetchUsersWithoutRoutine();
  }, [routineid]);


  const fetchRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("id", routineid)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      setRoutine(data as Routine);
    } catch (err) {
      setError("Error al obtener la rutina");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExerciseSets = async () => {
    try {
      const { data, error } = await supabase
        .from("exercisesets")
        .select("*, exercises(name)")
        .eq("routineid", routineid);
      if (error) {
        throw new Error(error.message);
      }
      setExerciseSets(data as ExerciseSet[]);
    } catch (err) {
      setError("Error al obtener los sets de ejercicios");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase.from("exercises").select("*");
      if (error) {
        throw new Error(error.message);
      }
      setExercises(data as Exercise[]);
    } catch (err) {
      setError("Error al obtener los ejercicios");
    }
  };

  const handleAssignRoutine = async () => {
    if (!selectedUserId) return;

    try {
      const { error } = await supabase
        .from('userroutines')
        .insert({ userid: selectedUserId, routineid: routineid });

      if (error) throw error;

      // Refresh the user list after assigning
      fetchUsersWithoutRoutine();
      setSelectedUserId('');
    } catch (err) {
      setError("Error al asignar la rutina");
    }
  };


  const fetchUsersWithoutRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')


      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError("Error al obtener usuarios sin esta rutina");
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExerciseSet((prevSet) => ({
      ...prevSet,
      [name]: name === "exerciseId" ? parseInt(value) : value,
    }));
  };

  const handleCreateExerciseSet = async () => {
    try {
      const { data, error } = await supabase.from("exercisesets").insert([
        {
          routineid: newExerciseSet.routineId,
          exerciseId: newExerciseSet.exerciseId,
          setnumber: newExerciseSet.setnumber,
          weight: newExerciseSet.weight,
          repetitions: newExerciseSet.repetitions,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
      setExerciseSets((prevSets) => [...prevSets, ...(data ?? [])]);
      setNewExerciseSet({
        id: 0,
        routineId: routineid,
        exerciseId: 0,
        setnumber: 0,
        weight: 0,
        repetitions: 0,
      });
      fetchExerciseSets();
    } catch (err) {
      setError("Error al crear el set de ejercicio");
    }
  };

  const handleEditExerciseSet = (exerciseSet: ExerciseSet) => {
    setEditingExerciseSetId(exerciseSet.id);
    setNewExerciseSet(exerciseSet);
  };

  const handleUpdateExerciseSet = async (exerciseSetId: number) => {
    try {
      const { error } = await supabase
        .from("exercisesets")
        .update(newExerciseSet)
        .eq("id", exerciseSetId);
      if (error) {
        throw new Error(error.message);
      }
      setExerciseSets((prevSets) =>
        prevSets.map((set) => (set.id === exerciseSetId ? { ...set, ...newExerciseSet } : set))
      );
      setNewExerciseSet({
        id: 0,
        routineId: 0,
        exerciseId: 0,
        setnumber: 0,
        weight: 0,
        repetitions: 0,
      });
      setEditingExerciseSetId(null);
    } catch (err) {
      setError("Error al actualizar el set de ejercicio");
    }
  };

  const handleDeleteExerciseSet = async (exerciseSetId: number) => {
    try {
      const { error } = await supabase.from("exercisesets").delete().eq("id", exerciseSetId);
      if (error) {
        throw new Error(error.message);
      }
      setExerciseSets((prevSets) => prevSets.filter((set) => set.id !== exerciseSetId));
    } catch (err) {
      setError("Error al eliminar el set de ejercicio");
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full container">
      <h1 className="text-3xl font-bold mb-8">Rutina: {routine?.name}</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Ejercicio</th>
            <th className="px-4 py-2">Set</th>
            <th className="px-4 py-2">Peso</th>
            <th className="px-4 py-2">Repeticiones</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {exerciseSets.map((set) => (
            <tr key={set.id} className="border-t">
              <td className="px-4 py-2">
                {editingExerciseSetId === set.id ? (
                  <select
                    name="exerciseId"
                    value={newExerciseSet.id}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  >
                    <option value="">Seleccionar ejercicio</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  set.exerciseId && exercises.find((exercise) => exercise.id === set.exerciseId)?.name
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="setnumber"
                    value={newExerciseSet.setnumber}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  set.setnumber
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="weight"
                    value={newExerciseSet.weight}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  set.weight
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="repetitions"
                    value={newExerciseSet.repetitions}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  set.repetitions
                )}
              </td>
              <td className="px-4 py-2 text-center">
                {editingExerciseSetId === set.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateExerciseSet(set.id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingExerciseSetId(null)}
                      className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditExerciseSet(set)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteExerciseSet(set.id)}
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
        <h2 className="text-xl font-bold mb-4">Asignar Rutina</h2>
        <div className="mb-4">
          <label htmlFor="userId" className="block mb-1">Usuario:</label>
          <select
            name="userId"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Seleccionar usuario</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAssignRoutine}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Asignar Rutina
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Crear nuevo set de ejercicio</h2>
        <div className="mb-4">
          <label htmlFor="exerciseId" className="block mb-1">Ejercicio:</label>
          <select
            name="exerciseId"
            value={newExerciseSet.exerciseId}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          >
            <option value="">Seleccionar ejercicio</option>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="setnumber" className="block mb-1">Set:</label>
          <input
            type="number"
            name="setnumber"
            value={newExerciseSet.setnumber}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="weight" className="block mb-1">Peso:</label>
          <input
            type="number"
            name="weight"
            value={newExerciseSet.weight}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="repetitions" className="block mb-1">Repeticiones:</label>
          <input
            type="number"
            name="repetitions"
            value={newExerciseSet.repetitions}
            onChange={handleInputChange}
            className="w-full px-2 py-1 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleCreateExerciseSet}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Crear set
        </button>
      </div>
    </div>
  );
};

export default Routine;
