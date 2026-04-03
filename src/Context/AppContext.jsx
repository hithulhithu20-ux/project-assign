import { createContext, useEffect, useState } from "react";
import API from "../services/api";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 👈 New loading state


  const login = async (email, password) => {
    try {
      const [adminRes, empRes, roleRes] = await Promise.all([
        API.get("/admin"),
        API.get("/employees"),
        API.get("/roles"),
      ]);

      // ✅ ADMIN LOGIN
      if (
        email === adminRes.data.email &&
        password === adminRes.data.password
      ) {
        

        const userData = {
          id: "admin",
          name: "Admin",
          isAdmin: true,
          role: {
            name: "Admin",
            permissions: {
              ALL: true,
              Dashboard: { view: true },
              Roles: { view: true, create: true, edit: true, delete: true },
              Employees: { view: true, create: true, edit: true, delete: true },
              Projects: { view: true, create: true, edit: true, delete: true },
              Tasks: { view: true, create: true, edit: true, delete: true },
              Notifications: { view: true },
            },
          },
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); 

        return true;
      }

      // ✅ EMPLOYEE LOGIN
      const employee = empRes.data.find(
        (e) =>
          e.email === email &&
          e.password === password &&
          e.status === "Active"
      );

      if (!employee) {
        alert("Invalid credentials");
        return false;
      }

      const role = roleRes.data.find(
        (r) => r.name === employee.role
      );

      if (!role) {
        alert("Role not found");
        return false;
      }

      const userData = {
        ...employee,
        role,
        isAdmin: false,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ ADD THIS

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };



  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // ✅ IMPORTANT
  };




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

  const updateRole = async (id, data) => {
    await API.put(`/roles/${id}`, data);
    fetchRoles();
  };

  const deleteRole = async (id) => {
    await API.delete(`/roles/${id}`);
    fetchRoles();
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  


  return (
    <AppContext.Provider value={{ roles, fetchRoles, addRole, user, login, logout, deleteRole, updateRole ,isLoading}}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;