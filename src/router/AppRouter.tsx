import { Route, Routes } from "react-router-dom";
import { CouchRoutes } from "../couch/routes/CouchRoutes";
// import LoginPage from "../pages/LoginPage";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* <Route path='login' element={<LoginPage />} /> */}
        {/* <Route path='/' element={<Navigate to='/login' />} /> */}

        <Route path='/*' element={<CouchRoutes />} />
      </Routes>
    </>
  );
};

export default AppRouter;
