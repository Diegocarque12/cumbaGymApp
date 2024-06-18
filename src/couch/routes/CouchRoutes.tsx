import { Navigate, Route, Routes } from "react-router-dom";
import Breadcrumb from "../../ui/Breadcrumb";
import Routines from "../pages/Routines";
import Nav from "../../ui/Nav";
import Routine from "../pages/Routine";
import CreateRoutine from "../pages/CreateRoutine";

export const CouchRoutes = () => {
  return (
    <>
      <Nav />
      <Breadcrumb />

      <div className=''>
        <Routes>
          <Route path='routines' element={<Routines />} />
          <Route path="/routines/:routineId" element={<Routine />} />
          <Route path="/add-routine" element={<CreateRoutine />} />
          <Route path='/' element={<Navigate to='/routines' />} />
        </Routes>
      </div>
    </>
  );
};
