


// import { Link, useLocation } from "react-router-dom";
// import { useContext } from "react";
// import { AppContext } from "../../Context/AppContext";
// import { hasPermission } from "../../utils/Permissions";

// const Sidebar = () => {
//   const location = useLocation();
//   const { user } = useContext(AppContext);

//   const menu = [
//     { name: "Dashboard", path: "/dashboard", module: "Dashboard" },
//     { name: "Roles", path: "/roles", module: "Roles" },
//     { name: "Employees", path: "/employees", module: "Employees" },
//     { name: "Projects", path: "/projects", module: "Projects" },
//     { name: "Tasks", path: "/tasks", module: "Tasks" },
//     { name: "Notifications", path: "/notifications", module: "Notifications" },
//   ];

//   const filteredMenu = menu.filter((item) => {
//     // ✅ Always show
//     if (item.name === "Dashboard" || item.name === "Notifications") {
//       return true;
//     }

//     return hasPermission(user, item.module, "view");
//   });

//   return (
//     <div className="w-64 min-h-screen bg-gray-900 text-white p-6">
//       <h1 className="text-xl font-bold mb-6 text-center">
//         🚀 Project Manager
//       </h1>

//       {filteredMenu.map((item) => (
//         <Link
//           key={item.path}
//           to={item.path}
//           className={`block px-4 py-2 rounded ${
//             location.pathname === item.path
//               ? "bg-blue-600"
//               : "hover:bg-gray-700"
//           }`}
//         >
//           {item.name}
//         </Link>
//       ))}
//     </div>
//   );
// };

// export default Sidebar;


import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { hasPermission } from "../../utils/Permissions";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Briefcase, 
  CheckSquare, 
  Bell 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useContext(AppContext);

  const menu = [
    { name: "Dashboard", path: "/dashboard", module: "Dashboard", icon: LayoutDashboard },
    { name: "Roles", path: "/roles", module: "Roles", icon: ShieldCheck },
    { name: "Employees", path: "/employees", module: "Employees", icon: Users },
    { name: "Projects", path: "/projects", module: "Projects", icon: Briefcase },
    { name: "Tasks", path: "/tasks", module: "Tasks", icon: CheckSquare },
    { name: "Notifications", path: "/notifications", module: "Notifications", icon: Bell },
  ];

  const filteredMenu = menu.filter((item) => {
    if (item.name === "Dashboard" || item.name === "Notifications") return true;
    return hasPermission(user, item.module, "view");
  });

  return (
    <div className="w-72 min-h-screen bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800">
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Briefcase size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">ProFlow.</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-indigo-600/10 text-indigo-400 font-semibold" : "hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"} />
                <span>{item.name}</span>
              </div>
              {isActive && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
            </Link>
          );
        })}
      </nav>

      {/* 🛠 FIXED SECTION: Handling the Object Error */}
      <div className="p-4 mt-auto border-t border-slate-800/50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-slate-700">
            {/* Safe check: render only a string */}
            {typeof user?.name === 'string' ? user.name.charAt(0) : "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
               {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500 truncate lowercase">
              {/* If role is an object {name, permissions}, we must access .name */}
              {typeof user?.role === 'object' ? user.role.name : user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;