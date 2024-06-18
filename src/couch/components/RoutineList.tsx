import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../ui/Card";
import supabase from "../../utils/supabaseClient";
import type { Routine } from "../../../interfaces/types";

const RoutineList = () => {
  const [routineList, setRoutinesList] = useState<Routine[]>([]);

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const { data, error } = await supabase.from("routines").select("*");

    if (error) {
      console.error("Error fetching routines:", error);
    } else {
      setRoutinesList(data as Routine[]);
    }
  };

  return (
    <div>
      <h1>Lista de Rutinas</h1>
      <ul>
        {routineList.map((routine) => (
          <li key={routine.id}>
            <Link to={`/routines/${routine.id}`}>
              <Card name={routine.name} />
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/add-routine">
        <button>Crear Rutina</button>
      </Link>
    </div>
  );
};

export default RoutineList;
