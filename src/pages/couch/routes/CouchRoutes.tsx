import { Navigate, Route, Routes } from "react-router-dom";
import Routines from "../pages/Routines";
import Nav from "../../../ui/AdminNav";
import Routine from "../pages/Routine";
import CreateRoutine from "../pages/CreateRoutine";
import TodayWorkout from "../pages/TodayWorkout";
import Exercises from "../pages/Exercises";
import Users from "../pages/Users";
import Dashboard from "../pages/Dashboard";
import UserMeasurement from "../pages/UserMeasurement";
import ShowUserData from "../components/users/ShowUserData";

const CouchRoutes = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/routines" element={<Routines />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId/edit" element={<ShowUserData />} />
        <Route path="/users/:userId/measurements" element={<UserMeasurement />} />
        <Route path="/routines/:routineId" element={<Routine />} />
        <Route path="/add-routine" element={<CreateRoutine />} />
        <Route path="/today-workout" element={<TodayWorkout />} />
        <Route path="/" element={<Navigate to="couch/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default CouchRoutes;
