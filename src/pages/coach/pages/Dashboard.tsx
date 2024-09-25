import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../../utils/supabaseClient";

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [routineCount, setRoutineCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { count: userCountData } = await supabase
        .from("users")
        .select("*", { count: "exact" });

      const { count: routineCountData } = await supabase
        .from("routines")
        .select("*", { count: "exact" });

      const { count: exerciseCountData } = await supabase
        .from("exercises")
        .select("*", { count: "exact" });

      setUserCount(userCountData || 0);
      setRoutineCount(routineCountData || 0);
      setExerciseCount(exerciseCountData || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="h-screen bg-bg-200">
      <header className="bg-bg-100 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-100">Dashboard del Entrenador</h1>
        </div>
      </header>
      <main className="container max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-bg-100 overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-4">
                  <svg
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-text-200 truncate">
                      Total de Usuarios
                    </dt>
                    <dd className="flex items-baseline mt-2">
                      <div className="text-4xl font-semibold text-primary-100">
                        {userCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-bg-200 px-6 py-4">
              <Link
                to="/coach/users"
                className="text-accent-100 hover:text-accent-200 transition-colors duration-200 font-medium flex items-center"
              >
                Ver detalles
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-bg-100 overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-4">
                  <svg
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-text-200 truncate">
                      Total de Rutinas
                    </dt>
                    <dd className="flex items-baseline mt-2">
                      <div className="text-4xl font-semibold text-primary-100">
                        {routineCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-bg-200 px-6 py-4">
              <Link
                to="/coach/routines"
                className="text-accent-100 hover:text-accent-200 transition-colors duration-200 font-medium flex items-center"
              >
                Ver detalles
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="bg-bg-100 overflow-hidden shadow-lg rounded-lg transition-all duration-300 hover:shadow-xl">
            <div className="px-6 py-8">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-full p-4">
                  <svg
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div className="ml-6 w-0 flex-1">
                  <dl>
                    <dt className="text-lg font-medium text-text-200 truncate">
                      Total de Ejercicios
                    </dt>
                    <dd className="flex items-baseline mt-2">
                      <div className="text-4xl font-semibold text-primary-100">
                        {exerciseCount}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-bg-200 px-6 py-4">
              <Link
                to="/coach/exercises"
                className="text-accent-100 hover:text-accent-200 transition-colors duration-200 font-medium flex items-center"
              >
                Ver detalles
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
