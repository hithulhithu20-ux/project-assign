import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";

// const Navbar = () => {
//   const { user, logout } = useContext(AppContext);

//   return (
//     <div className="flex justify-between p-4 bg-white shadow">
//       <h2>Welcome, {user.name}</h2>

      // <button
      //   onClick={logout}
      //   className="bg-red-500 text-white px-3 py-1 rounded"
      // >
      //   Logout
      // </button>
//     </div>
//   );
// };

// export default Navbar;

const Navbar = () => {
   const { user, logout } = useContext(AppContext);
  return (
    <div className="h-[60px] bg-white shadow flex items-center justify-between px-5">
      <h2 className="font-semibold text-lg">Dashboard</h2>

      <div className="flex items-center gap-3">
        <span className="text-sm">Welcome, {user.name}</span>
        <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full">
          {user.name.charAt(0).toUpperCase()}
        </div>
         <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
      </div>
     
    </div>
  );
};

export default Navbar;