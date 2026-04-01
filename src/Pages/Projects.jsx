import { useEffect, useState } from "react";
import API from "../services/api";
import { createNotification } from "../services/notificationService";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    team: [],
  });

  // 🔄 fetch data
  const fetchProjects = async () => {
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  // input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // team select (multi select)
  const handleTeamChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) =>
      Number(opt.value)
    );
    setForm({ ...form, team: selected });
  };

  // ➕ add project
  const handleAdd = async () => {
    if (!form.name) {
      alert("Enter project name");
      return;
    }

    const res = await API.post("/projects", form);

    // 🔔 notify all team members
    for (let userId of form.team) {
      await createNotification({
        message: `You are assigned to project ${form.name}`,
        userId,
        type: "project",
        read: false,
      });
    }

    setForm({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      team: [],
    });

    fetchProjects();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Projects</h1>

      {/* Form */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Create Project</h2>

        <div className="flex flex-wrap gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="border px-3 py-2 rounded w-48"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border px-3 py-2 rounded w-48"
          />

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          {/* Multi Select */}
          <select
            multiple
            onChange={handleTeamChange}
            className="border px-3 py-2 rounded w-48 h-24"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Projects List</h2>

        {projects.length === 0 && (
          <p className="text-gray-500">No projects found</p>
        )}

        {projects.map((proj) => (
          <div key={proj.id} className="border p-3 rounded mb-3">
            <h3 className="font-bold">{proj.name}</h3>
            <p>{proj.description}</p>

            <p className="text-sm text-gray-600">
              {proj.startDate} → {proj.endDate}
            </p>

            <div className="text-sm mt-2">
              <span className="font-medium">Team: </span>
              {proj.team
                ?.map(
                  (id) =>
                    employees.find((emp) => Number(emp.id) === Number(id))?.name
                )
                .join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;