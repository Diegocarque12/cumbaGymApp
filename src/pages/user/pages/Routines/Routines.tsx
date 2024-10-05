import Card from "@/ui/Card";
import supabase from "@/utils/supabaseClient";
import { Routine } from "interfaces/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const RoutineList = () => {
  const [routineList, setRoutinesList] = useState<Routine[]>([]);
  const sortedRoutines = [...routineList].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    fetchRoutines();
  }, []);

  const fetchRoutines = async () => {
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", (await supabase.auth.getUser())?.data.user?.id)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
      return;
    }

    const { data: routineIds } = await supabase
      .from("profile_routines")
      .select("routine_id")
      .eq("user_id", userData.id);

    const { data, error } = await supabase
      .from("routines")
      .select("*")
      .in("id", routineIds?.map(r => r.routine_id) || []);

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
      {sortedRoutines.length > 0 ? (
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
      ) : (
        <div className="text-center">
          <p>No se encontraron rutinas. ¡Pidele al coach que te asigne una!</p>
        </div>
      )}
    </div>
  );
};

const Routines = () => {
  return (
    <>
      <header className="bg-bg-100 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-100">Rutinas</h1>
        </div>
      </header>
      <RoutineList />
    </>
  );
};

export default Routines;
