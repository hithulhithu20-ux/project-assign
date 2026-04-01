

import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AppContext } from "../Context/AppContext";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const { roles } = useContext(AppContext);

    // 🔄 Fetch employees
    const fetchEmployees = async () => {
        const res = await API.get("/employees");
        setEmployees(res.data);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ➕ Add employee
    const handleAdd = async () => {
        try {
            if (!form.name || !form.email || !form.role) {
                alert("Fill all fields");
                return;
            }

            if (editId) {
                // ✏️ UPDATE
                await API.put(`/employees/${editId}`, {
                    ...form,
                    status: "Active",
                });
            } else {
                // ➕ CREATE
                await API.post("/employees", {
                    ...form,
                    status: "Active",
                });
            }

            // reset
            setForm({
                name: "",
                email: "",
                password: "",
                role: "",
            });

            setEditId(null);

            fetchEmployees();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (emp) => {
        setForm({
            name: emp.name,
            email: emp.email,
            password: emp.password,
            role: emp.role,
        });

        setEditId(emp.id);
    };

    // ❌ Delete employee
    const handleDelete = async (id) => {
        await API.delete(`/employees/${id}`);
        fetchEmployees();
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-5">Employees</h1>

            {/* Form */}
            <div className="bg-white p-5 rounded shadow mb-6">
                <h2 className="text-lg font-semibold mb-3">Add Employee</h2>

                <div className="flex gap-3 flex-wrap">
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Name"
                        className="border px-3 py-2 rounded w-48" />

                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="border px-3 py-2 rounded w-48" />

                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="border px-3 py-2 rounded w-48" />

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded w-48"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.name}>
                                {role.name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleAdd}
                        className="bg-green-600 text-white px-4 py-2 rounded">
                        {editId ? "Update" : "Add"}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white p-5 rounded shadow">
                <h2 className="text-lg font-semibold mb-3">Employee List</h2>

                <div className="grid grid-cols-5 font-semibold border-b pb-2 mb-2">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {employees.length === 0 && (
                    <p className="text-gray-500">No employees found</p>
                )}

                {employees.filter((emp) => emp.roleId !== 1)
  .map((emp) => (
                    <div
                        key={emp.id}
                        className="grid grid-cols-5 border p-2 rounded mb-2">
                        <span>{emp.name}</span>
                        <span>{emp.email}</span>
                        <span>{emp.role}</span>
                        <span className="text-green-600">{emp.status}</span>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(emp)}
                                className="bg-blue-500 text-white px-2 py-1 rounded">
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(emp.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Employees;