import RoutineList from "../components/RoutineList";

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
