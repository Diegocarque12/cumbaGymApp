import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "../../../ui/UserNav";
import Dashboard from "../pages/Dashboard";
import TodayWorkout from "../pages/TodayWorkout";
import { useCheckRole } from "@/hooks/useCheckRole";
import Profile from "../pages/Profile";
import Routines from "../pages/Routines/Routines";
import MeasurementDetails from "../pages/Measurements";
import WorkoutHistory from "../pages/Routines/WorkoutHistory";

const CouchRoutes = () => {
    useCheckRole("user");

    return (
        <>
            <Nav />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/routines" element={<Routines />} />
                <Route path="/measurements" element={<MeasurementDetails />} />
                <Route path="/workout-history" element={<WorkoutHistory />} />
                <Route path="/today-workout" element={<TodayWorkout />} />
                <Route path="/" element={<Navigate to="user/dashboard" replace />} />
            </Routes>
        </>
    );
};

export default CouchRoutes;
