import { useContext, useEffect, useState, useMemo } from "react";
import API from "../../services/api";
import { AppContext } from "../../Context/AppContext";
import { CheckCircle2, Clock, Briefcase, ListChecks, ArrowRight, Zap } from "lucide-react";

const EmployeeDashboard = () => {
  const { user } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, p] = await Promise.all([
          API.get("/tasks"),
          API.get("/projects"),
        ]);

        const myTasks = (t.data || []).filter(
          (task) => task.assignedTo === user.id
        );

        const myProjects = (p.data || []).filter((proj) =>
          proj.team?.includes(user.id)
        );

        setTasks(myTasks);
        setProjects(myProjects);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user]);

  // Memoized Stats
  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.status === "Done").length;
    const pending = tasks.filter(t => t.status !== "Done").length;
    return { completed, pending, total: tasks.length };
  }, [tasks]);

  if (isLoading) return <div className="p-10 text-center font-medium text-slate-500">Loading your workspace...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-slate-900">
      {/* 👋 GREETING SECTION */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Zap className="text-amber-600" size={20} fill="currentColor" />
          </div>
          <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Employee Portal</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Good day, {user?.name || "Team Member"}!
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          You have <span className="text-indigo-600 font-bold">{stats.pending} pending tasks</span> across {projects.length} projects today.
        </p>
      </header>

      {/* 📊 PERSONAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
            <ListChecks size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks</p>
            <p className="text-2xl font-black">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects</p>
            <p className="text-2xl font-black">{projects.length}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 📝 TASK LIST */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-bold">Current Assignments</h2>
            <button className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1">
              View All Tasks <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center py-10 text-slate-400 font-medium italic">No tasks assigned yet.</p>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${task.status === "Done" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                      {task.status === "Done" ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{task.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Project ID: {task.projectId}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg border ${
                    task.status === "Done" 
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
                      : task.status === "In Progress" 
                        ? "bg-amber-100 text-amber-700 border-amber-200" 
                        : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 📁 PROJECT LIST (Sidebar style) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6">My Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50">
                <p className="font-bold text-indigo-900 mb-1">{project.name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Team Project</span>
                  <div className="flex -space-x-2">
                    {/* Placeholder for team avatars */}
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-400 text-sm">Not assigned to any projects.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;