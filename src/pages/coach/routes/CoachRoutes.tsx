import { Navigate, Route, Routes } from "react-router-dom";
import Routines from "../pages/Routines";
import Nav from "../../../ui/CoachNav";
import Routine from "../pages/RoutineDetails";
import CreateRoutine from "../pages/CreateRoutine";
import TodayWorkout from "../pages/TodayWorkout";
import Exercises from "../pages/Exercises";
import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard";
import Measurement from "../pages/Measurement";
import UserDetails from "../components/users/UserDetails";
import WorkoutDone from "../pages/WorkoutDone";
import UserRoutinesDetails from "../components/users/UserRoutinesDetails";
import { useCheckRole } from "@/hooks/useCheckRole";

const CouchRoutes = () => {
  useCheckRole("coach");

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/:exercise_id" element={<Exercises />} />
        <Route path="/exercises/:exercise_id/edit" element={<Exercises />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:user_id/edit" element={<UserDetails />} />
        <Route path="/users/:user_id/routines" element={<UserRoutinesDetails />} />
        <Route path="/users/:user_id/measurements" element={<Measurement />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/routines/:routine_id" element={<Routine />} />
        <Route path="/add-routine" element={<CreateRoutine />} />
        <Route path="/today-workout" element={<TodayWorkout />} />
        <Route path="/workout-done" element={<WorkoutDone />} />
        <Route path="/" element={<Navigate to="coach/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default CouchRoutes;
