import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../../ui/Card";
import supabase from "../../../utils/supabaseClient";
import type { Routine } from "../../../../interfaces/types";

const RoutineList = () => {
  const [routineList, setRoutinesList] = useState<Routine[]>([]);
  const sortedRoutines = [...routineList].sort((a, b) => a.name.localeCompare(b.name));


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
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedRoutines.map((routine) => (
          <Link
            key={routine.id}
            to={`/coach/routines/${routine.id}`}
            className="transform hover:scale-105 transition duration-300"
          >
            <Card name={routine.name} description={routine.description} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoutineList;
