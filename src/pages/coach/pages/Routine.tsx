import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";
import type { Exercise, ExerciseSet, Routine, UserRoutine } from "../../../../interfaces/types";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const Routine = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const currentRoutineId = Number(routineId);
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [newExerciseSet, setNewExerciseSet] = useState<ExerciseSet>({
    id: 0,
    routineId: currentRoutineId,
    exerciseId: 0,
    setnumber: 0,
    weight: 0,
    repetitions: 0,
  });
  const [editingExerciseSetId, setEditingExerciseSetId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usersWithOutRoutine, setUsersWithOutRoutine] = useState<{ id: number; name: string }[]>([]);
  const [userRoutinesList, setUserRoutinesList] = useState<UserRoutine[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<{ id: number; name: string }[]>([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userRoutinesByRoutineId, setUserRoutinesByRoutineId] = useState<UserRoutine[]>([]);

  useEffect(() => {
    fetchRoutine();
    fetchUserRoutines();
    fetchExerciseSets();
    fetchExercises();
  }, [routineId]);

  useEffect(() => {
    test();
    fetchUsersWithoutRoutine()
  }, [userRoutinesList])

  useEffect(() => {
    fetchUsersWithoutRoutine()
  }, [userRoutinesByRoutineId])

  const fetchRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from("routines")
        .select("*")
        .eq("id", currentRoutineId)
        .single();
      if (error) {
        console.log('fetchRoutine error', error);
      }
      setRoutine(data as Routine);
    } catch (err) {
      setError("Error al obtener la rutina");
    } finally {
      setIsLoading(false);
    }
  };

  const test = () => {
    console.log('currentRoutineId', currentRoutineId);
    console.log('userRoutinesList', userRoutinesList);

    const urByRoutineId = userRoutinesList.filter(
      (userRoutine) => userRoutine.routineId === currentRoutineId
    );
    console.log('userRoutinesByRoutineId', userRoutinesByRoutineId);
    setUserRoutinesByRoutineId(urByRoutineId);
  }

  const fetchExerciseSets = async () => {
    try {
      const { data, error } = await supabase
        .from("exercisesets")
        .select("*, exercises(name)")
        .eq("routineId", currentRoutineId);
      if (error) {
        console.log('fetchExerciseSets error', error);
      }
      setExerciseSets(data as ExerciseSet[]);
    } catch (err) {
      setError("Error al obtener los sets de ejercicios");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from("userroutines")
        .select("*")
      if (error) {
        console.log('fetchUserRoutines error', error);
      }
      setUserRoutinesList(data as UserRoutine[]);
      console.log('testing', data);

    } catch (err) {
      setError("Error al obtener las rutinas de los usuarios");
    }
  };

  const handleAssignRoutine = async () => {
    if (!selectedUserId) return;
    try {
      const { error } = await supabase
        .from('userroutines')
        .insert({ userId: selectedUserId, routineId: currentRoutineId });
      if (error) console.log('handleAssignRoutine error', error);
      fetchUserRoutines();
      setSelectedUserId('');
    } catch (err) {
      setError("Error al asignar la rutina");
    }
  };

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase.from("exercises").select("*");
      if (error) {
        console.log('fetchExercises error', error);
      }
      setExercises(data as Exercise[]);
    } catch (err) {
      setError("Error al obtener los ejercicios");
    }
  };

  const fetchUsersWithoutRoutine = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .not('id', 'in', `(${userRoutinesByRoutineId.map((userRoutine) => userRoutine.userId).join(',')})`)
      if (error) console.log('fetchUsersWithoutRoutine error', error);
      console.log('userRoutinesList', userRoutinesList);
      setUsersWithOutRoutine(data || []);
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
      console.log(newExerciseSet);

      const { data, error } = await supabase.from("exercisesets").insert([
        {
          routineId: newExerciseSet.routineId,
          exerciseId: newExerciseSet.exerciseId,
          setnumber: newExerciseSet.setnumber,
          weight: newExerciseSet.weight,
          repetitions: newExerciseSet.repetitions,
        },
      ]);
      if (error) {
        console.log('handleCreateExerciseSet error', error);
      }
      setExerciseSets((prevSets) => [...prevSets, ...(data ?? [])]);
      setNewExerciseSet({
        id: 0,
        routineId: currentRoutineId,
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
      console.log(newExerciseSet);
      delete newExerciseSet.exercises;
      console.log(exerciseSetId);
      const { error } = await supabase
        .from("exercisesets")
        .update(newExerciseSet)
        .eq("id", exerciseSetId);
      if (error) {
        console.log('error', error);
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
        console.log('error', error);

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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full container my-4 h-screen">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Rutina: {routine?.name}</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Asignar Rutina</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Asignar Rutina</DialogTitle>
                <DialogDescription>
                  {
                    !showSearchInput &&
                    <>
                      <span>Selecciona un usuario para asignarle esta rutina.</span>
                      <br />
                    </>
                  }
                  {showSearchInput && (
                    <span>
                      Puedes buscar un usuario escribiendo su nombre en la barra de búsqueda. Y luego seleccionarlo en la lista de resultados.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex flex-col items-start gap-4">
                  <label htmlFor="userId" className="text-right">
                    Usuario:
                  </label>
                  <div className="relative col-span-3 w-full">
                    {showSearchInput &&
                      <div className="flex mb-2">
                        <input
                          type="text"
                          id="userSearch"
                          placeholder="Buscar usuario"
                          className="w-full px-2 py-1 border border-gray-300 rounded-l-md"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase()
                            const filteredUsers = usersWithOutRoutine.filter(user =>
                              user.name.toLowerCase().includes(searchTerm)
                            )
                            setFilteredUsers(filteredUsers)
                          }}
                        />
                        <button
                          onClick={() => {
                            setShowSearchInput(!showSearchInput)
                            setFilteredUsers(filteredUsers)
                          }}
                          className="text-white bg-red-700 px-1 rounded-r-md"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    }
                    <div className="flex">
                      <select
                        id="userId"
                        name="userId"
                        value={selectedUserId}
                        onChange={(e) =>
                          setSelectedUserId(e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-l-md"
                      >
                        <option value="">Seleccionar usuario</option>
                        {(usersWithOutRoutine.length > 0 ? usersWithOutRoutine : filteredUsers).map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowSearchInput(!showSearchInput)}
                        className={`text-gray-400 hover:text-gray-600 bg-slate-900 px-1 rounded-r-md ${showSearchInput ? 'hidden' : 'block'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => {
                  handleAssignRoutine()
                }}>Asignar Rutina</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Crear nuevo set de ejercicio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear nuevo set de ejercicio</DialogTitle>
                <DialogDescription>
                  Completa los detalles del nuevo set de ejercicio aquí.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="exerciseId" className="text-right">
                    Ejercicio
                  </label>
                  <select
                    name="exerciseId"
                    value={newExerciseSet.exerciseId}
                    onChange={handleInputChange}
                    className="col-span-3"
                  >
                    <option value="">Seleccionar ejercicio</option>
                    {exercises.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="setnumber" className="text-right">
                    Set
                  </label>
                  <input
                    id="setnumber"
                    name="setnumber"
                    type="number"
                    value={newExerciseSet.setnumber}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="weight" className="text-right">
                    Peso
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    value={newExerciseSet.weight}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="repetitions" className="text-right">
                    Repeticiones
                  </label>
                  <input
                    id="repetitions"
                    name="repetitions"
                    type="number"
                    value={newExerciseSet.repetitions}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="dialog-footer">
                <button onClick={handleCreateExerciseSet}>Crear set</button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
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
                  <label className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-700">
                    {exercises.find(exercise => exercise.id === newExerciseSet.exerciseId)?.name || 'Seleccionar ejercicio'}
                  </label>) : (
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
          {exerciseSets.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center pt-4">
                No hay sets de ejercicio disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Routine;
