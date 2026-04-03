// import { useEffect, useState } from "react";
// import API from "../../services/api";

// const Dashboard = () => {
//   const [projects, setProjects] = useState([]);
//   const [tasks, setTasks] = useState([]);
//   const [employees, setEmployees] = useState([]);

//   const fetchData = async () => {
//     const [p, t, e] = await Promise.all([
//       API.get("/projects"),
//       API.get("/tasks"),
//       API.get("/employees"),
//     ]);

//     setProjects(p.data || []);
//     setTasks(t.data || []);
//     setEmployees(e.data || []);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // 📊 GLOBAL STATS
//   const totalProjects = projects.length;
//   const totalTasks = tasks.length;
//   const totalEmployees = employees.length;

//   const completedTasks = tasks.filter(t => t.status === "Done").length;
//   const inProgressTasks = tasks.filter(t => t.status === "In Progress").length;
//   const todoTasks = tasks.filter(t => t.status === "To Do").length;

//   // 👨‍💻 EMPLOYEE PERFORMANCE
//   const employeeStats = employees.map(emp => {
//     const empTasks = tasks.filter(t => t.assignedTo === emp.id);

//     return {
//       name: emp.name,
//       total: empTasks.length,
//       completed: empTasks.filter(t => t.status === "Done").length,
//     };
//   });

//   return (
//     <div className="p-6 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6">
//         Admin Dashboard
//       </h1>

//       {/* 🔢 TOP STATS */}
//       <div className="grid md:grid-cols-4 gap-4 mb-8">
//         <div className="bg-blue-100 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold">Projects</h2>
//           <p className="text-2xl font-bold">{totalProjects}</p>
//         </div>

//         <div className="bg-green-100 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold">Tasks</h2>
//           <p className="text-2xl font-bold">{totalTasks}</p>
//         </div>

//         <div className="bg-purple-100 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold">Employees</h2>
//           <p className="text-2xl font-bold">{totalEmployees}</p>
//         </div>

//         <div className="bg-yellow-100 p-4 rounded-xl">
//           <h2 className="text-lg font-semibold">Completed</h2>
//           <p className="text-2xl font-bold">{completedTasks}</p>
//         </div>
//       </div>

//       {/* 📊 TASK STATUS */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           Task Status Overview
//         </h2>

//         <div className="flex gap-4 text-sm">
//           <span className="bg-green-100 px-3 py-1 rounded">
//             Done: {completedTasks}
//           </span>
//           <span className="bg-yellow-100 px-3 py-1 rounded">
//             In Progress: {inProgressTasks}
//           </span>
//           <span className="bg-blue-100 px-3 py-1 rounded">
//             To Do: {todoTasks}
//           </span>
//         </div>
//       </div>

//       {/* 📁 PROJECT PROGRESS */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           Project Progress
//         </h2>

//         <div className="space-y-4">
//           {projects.map(project => {
//             const projectTasks = tasks.filter(
//               t => t.projectId === project.id
//             );

//             if (projectTasks.length === 0) return null;

//             const total = projectTasks.length;
//             const completed = projectTasks.filter(
//               t => t.status === "Done"
//             ).length;

//             const progress = Math.round((completed / total) * 100);

//             return (
//               <div key={project.id}>
//                 <p className="font-medium">
//                   {project.name}
//                 </p>

//                 <div className="w-full bg-gray-200 h-3 rounded-full">
//                   <div
//                     className="bg-green-500 h-3 rounded-full"
//                     style={{ width: `${progress}%` }}
//                   />
//                 </div>

//                 <p className="text-xs text-gray-500">
//                   {completed}/{total} Completed ({progress}%)
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* 👨‍💻 EMPLOYEE PERFORMANCE */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h2 className="text-xl font-semibold mb-4">
//           Employee Performance
//         </h2>

//         <div className="space-y-3">
//           {employeeStats.map((emp, index) => (
//             <div
//               key={index}
//               className="flex justify-between border p-3 rounded"
//             >
//               <span>{emp.name}</span>

//               <span className="text-sm">
//                 ✅ {emp.completed} / {emp.total} Tasks
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import { useEffect, useState, useMemo } from "react";
import { CheckCircle, Clock, Layout, Users, BarChart3, ArrowUpRight } from "lucide-react"; // Optional icons
import API from "../../services/api";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, t, e] = await Promise.all([
        API.get("/projects"),
        API.get("/tasks"),
        API.get("/employees"),
      ]);
      setProjects(p.data || []);
      setTasks(t.data || []);
      setEmployees(e.data || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🧠 MEMOIZED STATS (Prevents re-calculating on every render)
  const stats = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "Done").length;
    return {
      totalProjects: projects.length,
      totalTasks: tasks.length,
      totalEmployees: employees.length,
      completedTasks: completed,
      inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
      todoTasks: tasks.filter((t) => t.status === "To Do").length,
      completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    };
  }, [projects, tasks, employees]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center font-medium">Loading Insights...</div>;
  }

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* HEADER */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Workspace Overview</h1>
          <p className="text-slate-500 mt-2">Monitoring {stats.totalProjects} active projects and team efficiency.</p>
        </div>
        <button 
          onClick={fetchData}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm"
        >
          Refresh Data
        </button>
      </header>

      {/* 🔢 KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Projects" value={stats.totalProjects} icon={<Layout className="text-blue-600" />} color="blue" />
        <StatCard title="Active Tasks" value={stats.totalTasks} icon={<BarChart3 className="text-purple-600" />} color="purple" />
        <StatCard title="Team Members" value={stats.totalEmployees} icon={<Users className="text-emerald-600" />} color="emerald" />
        <StatCard title="Success Rate" value={`${stats.completionRate}%`} icon={<CheckCircle className="text-orange-600" />} color="orange" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 📁 PROJECT PROGRESS LIST */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold">Project Progress</h2>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Status</span>
          </div>
          <div className="p-6 space-y-7">
            {projects.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              if (projectTasks.length === 0) return null;
              const completed = projectTasks.filter((t) => t.status === "Done").length;
              const progress = Math.round((completed / projectTasks.length) * 100);

              return (
                <div key={project.id} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1">
                      {project.name} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100" />
                    </span>
                    <span className="text-sm font-medium text-slate-500">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 👨‍💻 TOP PERFORMERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold">Team Performance</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {employees.map((emp) => {
              const empTasks = tasks.filter((t) => t.assignedTo === emp.id);
              const done = empTasks.filter((t) => t.status === "Done").length;
              return (
                <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{emp.name}</p>
                      <p className="text-xs text-slate-500">{empTasks.length} assigned</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{done} Done</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`h-1 w-4 rounded-full ${i < done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for KPI Cards
const StatCard = ({ title, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    emerald: "bg-emerald-50",
    orange: "bg-orange-50",
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;