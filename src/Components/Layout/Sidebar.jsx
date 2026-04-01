import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Roles", path: "/roles" },
    { name: "Employees", path: "/employees" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" },
    { name: "Notifications", path: "/notifications" },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h1 className="text-xl font-bold mb-6">Project Manager</h1>

      <div className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-2 rounded ${
              location.pathname === item.path
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;