import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, Search, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to login
  };

  // Helper to get initials safely
  const getInitial = () => {
    if (typeof user?.name === 'string') return user.name.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* LEFT SIDE: Page Context */}
      <div className="flex items-center gap-4">
        <h2 className="font-bold text-slate-800 text-lg tracking-tight">
          System Overview
        </h2>
       
      </div>

      {/* RIGHT SIDE: User Actions */}
      <div className="flex items-center gap-6">
        
        <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>


        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 px-4 py-2 rounded-xl text-sm font-bold transition-all border border-slate-200 hover:border-rose-100"
        >
          <LogOut size={16} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;