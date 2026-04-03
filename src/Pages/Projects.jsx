
import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { createNotification } from "../services/notificationService";
import { AppContext } from "../Context/AppContext";
import { hasPermission } from "../utils/Permissions";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Info,
  Clock
} from "lucide-react";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    team: [],
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name) return alert("Enter project name");

    const cleanTeam = form.team.filter(Boolean);

    if (editingProject) {
      await API.put(`/projects/${editingProject}`, { ...form, team: cleanTeam });
      setEditingProject(null);
    } else {
      await API.post("/projects", { ...form, team: cleanTeam });
      for (let userId of cleanTeam) {
        const emp = employees.find((e) => e.id === userId);
        await createNotification({
          message: `You are assigned to project ${form.name}`,
          userId,
          senderId: "ADMIN",
          senderName: "Admin",
          receiverName: emp?.name,
          type: "project",
          read: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    setForm({ name: "", description: "", startDate: "", endDate: "", team: [] });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (confirm("Permanently delete this project?")) {
      await API.delete(`/projects/${id}`);
      fetchProjects();
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      team: project.team || [],
    });
    setEditingProject(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleProjects = hasPermission(user, "Projects", "view")
    ? (user?.role?.permissions?.ALL
        ? projects
        : projects.filter((proj) => proj.team?.includes(user.id))
      ).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-800">
      
      {/* 1. HEADER SECTION */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <FolderKanban className="text-indigo-600" size={32} /> Project Pipeline
          </h1>
          <p className="text-slate-500 font-medium text-sm">Track milestones and team allocations</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Filter projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 text-sm shadow-sm"
          />
        </div>
      </header>

      {/* 2. ADD/EDIT SECTION */}
      {hasPermission(user, "Projects", "create") && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className={`p-1.5 rounded-lg ${editingProject ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {editingProject ? <Edit3 size={16}/> : <Plus size={16}/>}
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
              {editingProject ? "Modify Project Scope" : "Initialize New Project"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-1.5 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Project Identity</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Project Name" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief objective..." className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all h-20 resize-none mt-2" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                <Users size={10}/> Assign Resources
              </label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 h-[130px] overflow-y-auto scrollbar-hide">
                {employees.map((emp) => (
                  <label key={emp.id} className="flex items-center gap-2 mb-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      value={emp.id}
                      checked={form.team.includes(emp.id)}
                      onChange={(e) => {
                        const id = e.target.value;
                        e.target.checked 
                          ? setForm({ ...form, team: [...form.team, id] })
                          : setForm({ ...form, team: form.team.filter((t) => t !== id) });
                      }}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{emp.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-end">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5 text-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Start</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-[11px] font-bold outline-none" />
                </div>
                <div className="space-y-1.5 text-center">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Deadline</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-[11px] font-bold outline-none" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAdd} className={`flex-1 h-[42px] flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all shadow-md ${editingProject ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 hover:bg-indigo-600 text-white'}`}>
                  {editingProject ? <Check size={18}/> : <Plus size={18}/>} {editingProject ? "Update" : "Launch Project"}
                </button>
                {editingProject && (
                  <button onClick={() => { setEditingProject(null); setForm({ name: "", description: "", startDate: "", endDate: "", team: [] }); }} className="h-[42px] px-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200">
                    <X size={18}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. LIST SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProjects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <FolderKanban className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Projects Found</p>
          </div>
        )}

        {visibleProjects.map((proj) => (
          <div key={proj.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex flex-col group">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-inner">
                  {proj.name.charAt(0)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {hasPermission(user, "Projects", "edit") && (
                    <>
                      <button onClick={() => handleEdit(proj)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(proj.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16}/></button>
                    </>
                  )}
                </div>
              </div>

              <h3 className="font-black text-slate-900 text-lg leading-tight mb-2">{proj.name}</h3>
              <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-4 leading-relaxed italic">
                {proj.description || "No project description provided."}
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400"/> Timeline</span>
                  <span className="text-slate-600">{proj.startDate || '??'} — {proj.endDate || '??'}</span>
                </div>
                
                <div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 block mb-2">Resource Allocation</span>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.team?.map((id) => {
                      const empName = employees.find(e => e.id === id)?.name;
                      return empName ? (
                        <span key={id} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg border border-slate-200">
                          {empName}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-3xl flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                <Check size={12}/> Active
              </span>
              <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">View Roadmap</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;