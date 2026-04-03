import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { createNotification } from "../services/notificationService";
import { AppContext } from "../Context/AppContext";
import { Plus, Trash2, CheckCircle2, Clock, ListTodo, Calendar, User, Briefcase, Edit3 } from "lucide-react";

const Tasks = () => {
  const { user } = useContext(AppContext);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tempTasks, setTempTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Low",
    dueDate: "",
  });

  console.log(
    "hhds"
  );
  

  const fetchData = async () => {
    const [t, p, e] = await Promise.all([
      API.get("/tasks"),
      API.get("/projects"),
      API.get("/employees"),
    ]);
    setTasks(t.data || []);
    setProjects(p.data || []);
    setEmployees(e.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const teamMembers = employees.filter((emp) => selectedProject?.team?.includes(emp.id));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTempTask = () => {
    if (!form.title || !form.assignedTo) {
      alert("Fill all fields");
      return;
    }
    setTempTasks([...tempTasks, { ...form, projectId: selectedProjectId, status: "To Do" }]);
    setForm({ title: "", description: "", assignedTo: "", priority: "Low", dueDate: "" });
  };

  const removeTempTask = (index) => {
    const updated = [...tempTasks];
    updated.splice(index, 1);
    setTempTasks(updated);
  };

  const handleSubmitAll = async () => {
    if (tempTasks.length === 0) {
      alert("No tasks added");
      return;
    }
    for (let task of tempTasks) {
      await API.post("/tasks", task);

      const assignedEmp = employees.find((e) => e.id === task.assignedTo);

      // ✅ Notification for Employee
      await createNotification({
        message: `New task assigned: ${task.title}`,
        userId: task.assignedTo,
        senderId: "ADMIN",
        senderName: "Admin",
        receiverName: assignedEmp?.name,
        type: "task",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // ✅ Separate Notification for Admin (log)
      await createNotification({
        message: `Task "${task.title}" assigned to ${assignedEmp?.name}`,
        userId: "ADMIN",
        senderId: "ADMIN",
        senderName: "Admin",
        type: "task",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    setTempTasks([]);
    setSelectedProjectId("");
    fetchData();
  };

  const updateStatus = async (task, status) => {
    await API.put(`/tasks/${task.id}`, { ...task, status });
    if (status === "Done") {
      await createNotification({
        message: `Task "${task.title}" completed`,
        userId: "ADMIN",
        senderId: user.id,
        senderName: user.name,
        type: "task",
        read: false,
        createdAt: new Date().toISOString(),
      });

      // ✅ Optional: notify employee themselves (history)
      await createNotification({
        message: `You completed task: ${task.title}`,
        userId: user.id,
        senderId: user.id,
        senderName: user.name,
        type: "task",
        read: false,
        createdAt: new Date().toISOString(),
      });
    }
    fetchData();
  };

  const visibleTasks = user?.isAdmin ? tasks : tasks.filter((t) => t.assignedTo === user.id);

  // Status Badge Helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "Done": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "In Progress": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // ✏️ EDIT TASK
  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setSelectedProjectId(task.projectId);
  };

  // 💾 UPDATE TASK
  const handleUpdateTask = async () => {
    if (!editingTask) return;

    await API.put(`/tasks/${editingTask}`, {
      ...form,
      projectId: selectedProjectId,
      status: "To Do", // keep or preserve if needed
    });

    setEditingTask(null);
    setForm({
      title: "",
      description: "",
      assignedTo: "",
      priority: "Low",
      dueDate: "",
    });

    fetchData();
  };

  // 🗑 DELETE TASK
  const handleDeleteTask = async (id) => {
    const confirmDelete = confirm("Delete this task?");
    if (!confirmDelete) return;

    await API.delete(`/tasks/${id}`);
    fetchData();
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <ListTodo className="text-indigo-600" size={36} />
          Task Management
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Organize, track, and complete your project milestones.</p>
      </header>

      {/* 🛠 ADMIN TASK CREATION PANEL */}
      {user?.isAdmin && (
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-10 transition-all hover:shadow-md">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Plus className="bg-indigo-100 text-indigo-600 rounded-lg p-1" />
            Quick Assign
          </h2>

          <div className="space-y-6">
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full md:w-1/3 bg-slate-50 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            >
              <option value="">Select Project Target</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            {selectedProject && (
              <div className="grid md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                <input name="title" value={form.title} onChange={handleChange} placeholder="Task Title" className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3" />
                <input name="description" value={form.description} onChange={handleChange} placeholder="Brief details..." className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3" />
                <select name="assignedTo" value={form.assignedTo} onChange={handleChange} className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3">
                  <option value="">Assign To Employee</option>
                  {teamMembers.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="bg-slate-50 border-slate-200 rounded-xl px-4 py-3" />

                {/* <button onClick={addTempTask} className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> Buffer Task
                </button> */}
                <button
                  onClick={editingTask ? handleUpdateTask : addTempTask}
                  className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  {editingTask ? "Update Task" : "Buffer Task"}
                </button>
              </div>
            )}

            {tempTasks.length > 0 && (
              <div className="mt-8 pt-8 border-t border-dashed border-slate-200">
                <h3 className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Preparation Queue</h3>
                <div className="grid gap-3">
                  {tempTasks.map((t, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="font-semibold text-slate-700">{t.title} <span className="text-slate-400 font-normal">assigned to</span> {employees.find(e => e.id === t.assignedTo)?.name}</span>
                      <button onClick={() => removeTempTask(i)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button onClick={handleSubmitAll} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-100 mt-4">
                    Confirm & Dispatch All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 📋 TASK LIST VIEW */}
      {user?.isAdmin ? (
        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project) => {
            const projectTasks = tasks.filter((t) => t.projectId === project.id);
            if (projectTasks.length === 0) return null;

            const total = projectTasks.length;
            const completed = projectTasks.filter(t => t.status === "Done").length;
            const progress = Math.round((completed / total) * 100);

            return (
              <div key={project.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                      <Briefcase className="text-indigo-500" size={20} /> {project.name}
                    </h2>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-slate-100">{progress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1">
                  {projectTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex justify-between items-center p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 transition-all group">
                      <div>
                        <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <User size={12} /> {employees.find(e => e.id === task.assignedTo)?.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status */}
                        <span
                          className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg border ${getStatusStyle(task.status)}`}
                        >
                          {task.status}
                        </span>

                        {/* ✏️ Edit */}
                        <button
                          onClick={() => handleEditTask(task)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={16} />

                        </button>

                        {/* 🗑 Delete */}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black">My Personal Backlog</h2>
            <div className="flex gap-2">
              <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-sm font-bold">{visibleTasks.length} Tasks Total</span>
            </div>
          </div>

          {visibleTasks.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">All caught up! No pending tasks.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div key={task.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase text-indigo-500 tracking-tighter bg-indigo-50 px-2 py-0.5 rounded italic">
                        {project?.name || "No Project"}
                      </span>
                      <Calendar size={16} className="text-slate-300" />
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-slate-800 leading-tight">{task.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">{task.description}</p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={14} /> {task.dueDate}
                        </span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task, e.target.value)}
                        className={`w-full font-bold py-2 rounded-xl border text-sm transition-all focus:ring-4 focus:ring-slate-100 ${getStatusStyle(task.status)}`}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;