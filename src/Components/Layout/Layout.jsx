import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-5 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />   {/* 🔥 THIS RENDERS CHILD ROUTES */}
        </div>
      </div>
    </div>
  );
};

export default Layout;


// import { useState } from "react";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// const Layout = ({ children }) => {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar - Desktop */}
//       <div className="hidden md:block">
//         <Sidebar />
//       </div>

//       {/* Sidebar - Mobile */}
//       {open && (
//         <div className="fixed inset-0 z-40 flex">
//           {/* Overlay */}
//           <div
//             className="fixed inset-0 bg-black/60 bg-opacity-40"
//             onClick={() => setOpen(false)}
//           ></div>

//           {/* Sidebar panel */}
//           <div className="relative z-50">
//             <Sidebar />
//           </div>
//         </div>
//       )}

//       {/* Main Section */}
//       <div className="flex-1 flex flex-col">
//         {/* Navbar */}
//         <div className="bg-white shadow-md flex items-center justify-between px-4">
          
//           {/* Mobile Menu Button */}
//           <button
//             className="md:hidden bg-white text-2xl"
//             onClick={() => setOpen(true)}
//           >
//             ☰
//           </button>

//           <div className="flex-1">
//             <Navbar />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           <div className="bg-white rounded-2xl shadow-sm p-5 min-h-full border border-gray-200">
//             {children}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;