import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Roles from "./Pages/Roles";
import Employees from "./Pages/Employees";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Notifications from "./Pages/Notifications";
import Dashboard from "./Pages/DashBoard/Dashboard";
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import Login from "./Pages/Login";
import ProtectedRoute from "./route/ProtectedRoute";

const App = () => {
  const { user, isLoading } = useContext(AppContext);

  // 🔐 If NOT logged in → only Login page

if (isLoading) return null;


  // ✅ If logged in → full app
  return (
    <>
     <Routes>
  <Route path="/" element={user ? <Navigate  to="/dashboard" /> : <Login />} />

  <Route
    element={
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/roles" element={<Roles />} />
    <Route path="/employees" element={<Employees />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="/notifications" element={<Notifications />} />
  </Route>
</Routes>
    </>
  );
};

export default App;