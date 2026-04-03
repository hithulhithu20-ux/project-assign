import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user,isLoading } = useContext(AppContext);


  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;