import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  path: string;
  label: string;
}

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbItems: BreadcrumbItem[] = [
    { path: "/", label: "Home" },
    { path: "/routines", label: "Routines" },
    { path: "/exercises", label: "Exercises" },
    { path: "/today-workout", label: "Today Workout" },
  ];

  return (
    <nav className="flex mb-8 container mx-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {pathnames.map((_, index) => {
          const isLast = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const breadcrumbItem = breadcrumbItems.find((item) => item.path === to);

          return isLast ? (
            <li key={to} className="inline-flex items-center">
              <span className="inline-flex items-center text-md font-medium text-gray-500">
                {breadcrumbItem?.label || pathnames[index]}
              </span>
            </li>
          ) : (
            <li key={to} className="inline-flex items-center">
              <Link
                to={to}
                className="inline-flex items-center text-md font-medium text-gray-700 hover:text-blue-600"
              >
                {breadcrumbItem?.label || pathnames[index]}
              </Link>
              <svg
                className="w-6 h-6 text-gray-400 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
