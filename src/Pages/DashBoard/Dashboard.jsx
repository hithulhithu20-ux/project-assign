import { useContext } from "react";
import { AppContext } from "../../Context/AppContext";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";


const Dashboard = () => {
  const { user } = useContext(AppContext);

  if (!user) return <p>Loading...</p>;

  return user.isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;