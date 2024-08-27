import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "../../../ui/UserNav";
import Dashboard from "../pages/Dashboard";
import TodayWorkout from "../pages/TodayWorkout";

const CouchRoutes = () => {
    return (
        <>
            <Nav />
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/routines" element={<Routines />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/users" element={<Users />} />
                <Route path="/routines/:routine_id" element={<Routine />} /> */}
                {/* <Route path="/add-routine" element={<CreateRoutine />} /> */}
                <Route path="/today-workout" element={<TodayWorkout />} />
                <Route path="/" element={<Navigate to="user/dashboard" replace />} />
            </Routes>
        </>
    );
};

export default CouchRoutes;
