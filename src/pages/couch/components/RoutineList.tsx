import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../ui/Card";
import supabase from "../../../utils/supabaseClient";
import type { Routine } from "../../../../interfaces/types";

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
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Lista de Rutinas</h1>
      <div className="mb-8">
        <Link
          to="/couch/add-routine"
          className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Crear Rutina
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {routineList.map((routine) => (
          <Link
            key={routine.id}
            to={`/couch/routines/${routine.id}`}
            className="hover:shadow-lg transition duration-300"
          >
            <Card name={routine.name} description={routine.description} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoutineList;
