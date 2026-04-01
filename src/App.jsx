
import { Routes, Route } from "react-router-dom";

import Layout from "./Components/Layout/Layout";
import Roles from "./Pages/Roles";
import Employees from "./Pages/Employees";
import Projects from "./Pages/Projects";
import Tasks from "./Pages/Tasks";
import Notifications from "./Pages/Notifications";
import Dashboard from "./Pages/Dashboard";
import { AppContext } from "./Context/AppContext";
import { useContext } from "react";
import Login from "./Pages/Login";

const App = () => {
  const { user } = useContext(AppContext);

  // 🔐 Not logged in → show login
  if (!user) {
    return <Login />;
  }

  return (
    
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </Layout>
    
  );
}

export default App;