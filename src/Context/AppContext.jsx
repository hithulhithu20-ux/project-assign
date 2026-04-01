import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const [empRes, roleRes] = await Promise.all([
      API.get("/employees"),
      API.get("/roles"),
    ]);

    const employee = empRes.data.find(
      (e) =>
        e.email === email &&
        e.password === password &&
        e.status === "Active"
    );

    if (!employee) return false;

    const role = roleRes.data.find(
      (r) => r.id === employee.roleId
    );

    setUser({
      ...employee,
      role,
    });

    return true;
  };

  const logout = () => setUser(null);

  // 🔄 fetch roles
  const fetchRoles = async () => {
    const res = await API.get("/roles");
    setRoles(res.data);
  };

  // ➕ add role
  const addRole = async (data) => {
    await API.post("/roles", data);
    fetchRoles(); // refresh globally
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <AppContext.Provider value={{ roles, fetchRoles, addRole, user, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;