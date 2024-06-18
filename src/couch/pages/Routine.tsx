import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabaseClient";
import type { ExerciseSet, Routine } from "../../../interfaces/types";

const Routine = () => {
  const { routineId } = useParams<{ routineId: string }>();
  const routineid = parseInt(routineId || "0");
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([]);
  const [newExerciseSet, setNewExerciseSet] = useState<ExerciseSet>({
    id: 0,
    routineId: routineid,
    machinename: "",
    setnumber: 0,
    weight: 0,
    repetitions: 0,
  });
  const [editingExerciseSetId, setEditingExerciseSetId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutine();
    fetchSets();
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

  const fetchSets = async () => {
    try {
      const { data, error } = await supabase
        .from("exercisesets")
        .select("*")
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExerciseSet((prevSet) => ({
      ...prevSet,
      [name]: value,
    }));
  };

  const handleCreateExerciseSet = async () => {
    try {
      const { data, error } = await supabase.from("exercisesets").insert([newExerciseSet]);
      if (error) {
        throw new Error(error.message);
      }
      setExerciseSets((prevSets) => data ? [...prevSets, ...data as ExerciseSet[]] : prevSets);
      setNewExerciseSet({
        id: 0,
        routineId: 0,
        machinename: "",
        setnumber: 0,
        weight: 0,
        repetitions: 0,
      });
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
        machinename: "",
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
    <div>
     <h1>Rutina: {routine?.name}</h1>
      <table>
        <thead>
          <tr>
            <th>Rutina</th>
            <th>Ejercicio</th>
            <th>Set</th>
            <th>Peso</th>
            <th>Repeticiones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {exerciseSets.map((set) => (
            <tr key={set.id}>
              <td>
                {editingExerciseSetId === set.id ? (
                  <input
                    type="text"
                    name="machinename"
                    value={newExerciseSet.machinename}
                    onChange={handleInputChange}
                  />
                ) : (
                  set.machinename
                )}
              </td>
              <td>
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="setnumber"
                    value={newExerciseSet.setnumber}
                    onChange={handleInputChange}
                  />
                ) : (
                  set.setnumber
                )}
              </td>
              <td>
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="weight"
                    value={newExerciseSet.weight}
                    onChange={handleInputChange}
                  />
                ) : (
                  set.weight
                )}
              </td>
              <td>
                {editingExerciseSetId === set.id ? (
                  <input
                    type="number"
                    name="repetitions"
                    value={newExerciseSet.repetitions}
                    onChange={handleInputChange}
                  />
                ) : (
                  set.repetitions
                )}
              </td>
              <td>
                {editingExerciseSetId === set.id ? (
                  <>
                    <button onClick={() => handleUpdateExerciseSet(set.id)}>Guardar</button>
                    <button onClick={() => setEditingExerciseSetId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditExerciseSet(set)}>Editar</button>
                    <button onClick={() => handleDeleteExerciseSet(set.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Crear nuevo set de ejercicio</h2>
        <div>
          <label>Ejercicio:</label>
          <input
            type="text"
            name="machinename"
            value={newExerciseSet.machinename}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Ejercicio:</label>
          <input
            type="text"
            name="machinename"
            value={newExerciseSet.machinename}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Set:</label>
          <input
            type="number"
            name="setnumber"
            value={newExerciseSet.setnumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Peso:</label>
          <input
            type="number"
            name="weight"
            value={newExerciseSet.weight}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Repeticiones:</label>
          <input
            type="number"
            name="repetitions"
            value={newExerciseSet.repetitions}
            onChange={handleInputChange}
          />
        </div>
         <button onClick={handleCreateExerciseSet}>Crear set</button>
      </div>
    </div>
  );
};

export default Routine;
