import { useEffect, useState } from "react";
import API from "../services/api";
import { createNotification } from "../services/notificationService";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "To Do",
    priority: "Low",
    dueDate: "",
  });

  // 🔄 fetch data
  const fetchData = async () => {
    const [t, p, e] = await Promise.all([
      API.get("/tasks"),
      API.get("/projects"),
      API.get("/employees"),
    ]);

    setTasks(t.data);
    setProjects(p.data);
    setEmployees(e.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // filter team members based on project
  const selectedProject = projects.find(
    (p) => p.id === Number(form.projectId)
  );

  const teamMembers = employees.filter((emp) =>
    selectedProject?.team?.includes(emp.id)
  );

  // ➕ add task
 const handleAdd = async () => {
  if (!form.title || !form.projectId) {
    alert("Fill required fields");
    return;
  }

  const res = await API.post("/tasks", {
    ...form,
    projectId: Number(form.projectId),
    assignedTo: Number(form.assignedTo),
  });

  // 🔔 notify assigned user
  await createNotification({
    message: `You have a new task: ${form.title}`,
    userId: Number(form.assignedTo),
    type: "task",
    read: false,
  });

  setForm({
    title: "",
    description: "",
    projectId: "",
    assignedTo: "",
    status: "To Do",
    priority: "Low",
    dueDate: "",
  });

  fetchData();
};

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Tasks</h1>

      {/* Form */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Create Task</h2>

        <div className="flex flex-wrap gap-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="border px-3 py-2 rounded w-48"
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border px-3 py-2 rounded w-48"
          />

          {/* Project */}
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-48"
          >
            <option value="">Select Project</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
          </select>

          {/* Assign user (filtered) */}
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-48"
          >
            <option value="">Assign To</option>
            {teamMembers.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Done</option>
          </select>

          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
          />

          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Tasks List</h2>

        {tasks.map((task) => {
          const project = projects.find(
            (p) => p.id === task.projectId
          );
          const user = employees.find(
            (e) => e.id === task.assignedTo
          );

          return (
            <div key={task.id} className="border p-3 rounded mb-3">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>

              <p className="text-sm">
                Project: {project?.name} | Assigned: {user?.name}
              </p>

              <p className="text-sm">
                Status: {task.status} | Priority: {task.priority}
              </p>

              <p className="text-sm text-gray-600">
                Due: {task.dueDate}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;