
// import { useContext, useEffect, useState } from "react";
// import API from "../services/api";
// import { AppContext } from "../Context/AppContext";
// import { hasPermission } from "../utils/Permissions";

// const Employees = () => {
//     const [employees, setEmployees] = useState([]);
//     const [editId, setEditId] = useState(null);

//     const [form, setForm] = useState({
//         name: "",
//         email: "",
//         password: "",
//         role: "",
//     });

//     const { roles,user } = useContext(AppContext);

//     const fetchEmployees = async () => {
//         const res = await API.get("/employees");
//         setEmployees(res.data);
//     };

//     useEffect(() => {
//         fetchEmployees();
//     }, []);

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleAdd = async () => {
//         try {
//             if (!form.name || !form.email || !form.role) {
//                 alert("Fill all fields");
//                 return;
//             }

//             if (editId) {
//                 await API.put(`/employees/${editId}`, {
//                     ...form,
//                     status: "Active",
//                 });
//             } else {
//                 await API.post("/employees", {
//                     ...form,
//                     status: "Active",
//                 });
//             }

//             setForm({
//                 name: "",
//                 email: "",
//                 password: "",
//                 role: "",
//             });

//             setEditId(null);
//             fetchEmployees();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const handleEdit = (emp) => {
//         setForm({
//             name: emp.name,
//             email: emp.email,
//             password: emp.password,
//             role: emp.role,
//         });

//         setEditId(emp.id);
//     };

//     const handleDelete = async (id) => {
//         await API.delete(`/employees/${id}`);
//         fetchEmployees();
//     };

//     return (
//         <div className="p-6 min-h-screen">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">
//                 Employee Management
//             </h1>

//             {/* Form Card */}
//             {hasPermission(user, "Employees", "create") && (
//                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-8">
//                     <h2 className="text-xl font-semibold mb-5 text-gray-700">
//                         {editId ? "Edit Employee" : "Add New Employee"}
//                     </h2>

//                     <div className="grid md:grid-cols-5 gap-4">
//                         <input
//                             name="name"
//                             value={form.name}
//                             onChange={handleChange}
//                             placeholder="Name"
//                             className="border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 px-3 py-2 rounded-lg transition"
//                         />

//                         <input
//                             name="email"
//                             value={form.email}
//                             onChange={handleChange}
//                             placeholder="Email"
//                             className="border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 px-3 py-2 rounded-lg transition"
//                         />

//                         <input
//                             name="password"
//                             value={form.password}
//                             onChange={handleChange}
//                             placeholder="Password"
//                             className="border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 px-3 py-2 rounded-lg transition"
//                         />

//                         <select
//                             name="role"
//                             value={form.role}
//                             onChange={handleChange}
//                             className="border border-gray-300 focus:ring-2 focus:ring-green-200 focus:border-green-500 px-3 py-2 rounded-lg transition"
//                         >
//                             <option value="">Select Role</option>
//                             {roles.map((role) => (
//                                 <option key={role.id} value={role.name}>
//                                     {role.name}
//                                 </option>
//                             ))}
//                         </select>

//                         <button
//                             onClick={handleAdd}
//                             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
//                         >
//                             {editId ? "Update" : "+ Add"}
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Employee List */}
//             {hasPermission(user, "Employees", "view") && (
//                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
//                     <h2 className="text-xl font-semibold mb-5 text-gray-700">
//                         Employee List
//                     </h2>

//                     {employees.length === 0 && (
//                         <p className="text-gray-500 text-center py-6">
//                             No employees found 🚀
//                         </p>
//                     )}

//                     <div className="grid gap-4">
//                         {employees
//                             .filter((emp) => emp.roleId !== 1)
//                             .map((emp) => (
//                                 <div
//                                     key={emp.id}
//                                     className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 border rounded-xl p-4 hover:shadow-md transition"
//                                 >
//                                     {/* Info */}
//                                     <div className="grid md:grid-cols-4 gap-2 flex-1">
//                                         <div>
//                                             <p className="text-xs text-gray-500">
//                                                 Name
//                                             </p>
//                                             <p className="font-medium text-gray-800">
//                                                 {emp.name}
//                                             </p>
//                                         </div>

//                                         <div>
//                                             <p className="text-xs text-gray-500">
//                                                 Email
//                                             </p>
//                                             <p className="text-gray-700">
//                                                 {emp.email}
//                                             </p>
//                                         </div>

//                                         <div>
//                                             <p className="text-xs text-gray-500">
//                                                 Role
//                                             </p>
//                                             <p className="text-gray-700">
//                                                 {emp.role}
//                                             </p>
//                                         </div>

//                                         <div>
//                                             <p className="text-xs text-gray-500">
//                                                 Status
//                                             </p>
//                                             <span className="text-green-600 font-medium">
//                                                 {emp.status}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Actions */}
//                                     <div className="flex gap-2 mt-3 md:mt-0">
//                                         {hasPermission(user, "Employees", "edit") && (
//                                             <button
//                                                 onClick={() => handleEdit(emp)}
//                                                 className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition"
//                                             >
//                                                 Edit
//                                             </button>
//                                         )}
//                                         {hasPermission(user, "Employees", "delete") && (
//                                             <button
//                                                 onClick={() =>
//                                                     handleDelete(emp.id)
//                                                 }
//                                                 className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
//                                             >
//                                                 Delete
//                                             </button>
//                                         )}
//                                     </div>
//                                 </div>
//                             ))}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Employees;

import { useContext, useEffect, useState } from "react";
import API from "../services/api";
import { AppContext } from "../Context/AppContext";
import { hasPermission } from "../utils/Permissions";
import { Users, UserPlus, Mail, ShieldCheck, Trash2, Edit3, Search, BadgeCheck, X, Check } from "lucide-react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "" });
  const { roles, user } = useContext(AppContext);

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async () => {
    try {
      if (!form.name || !form.email || !form.role) return alert("Fill all fields");
      const payload = { ...form, status: "Active" };
      editId ? await API.put(`/employees/${editId}`, payload) : await API.post("/employees", payload);
      resetForm();
      fetchEmployees();
    } catch (error) { console.error(error); }
  };

  const resetForm = () => { setForm({ name: "", email: "", password: "", role: "" }); setEditId(null); };

  const handleDelete = async (id) => {
    if (confirm("Remove this employee?")) { await API.delete(`/employees/${id}`); fetchEmployees(); }
  };

  const filteredEmployees = employees
    .filter((emp) => emp.id !== "admin")
    .filter((emp) => emp.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* 1. HEADER SECTION */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <Users className="text-indigo-600" size={32} /> Team Members
          </h1>
          <p className="text-slate-500 font-medium text-sm">Directory and access management</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text"
            placeholder="Quick search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-64 text-sm shadow-sm"
          />
        </div>
      </header>

      {/* 2. TOP ADD/EDIT SECTION (Full Width) */}
      {hasPermission(user, "Employees", "create") && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-lg ${editId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {editId ? <Edit3 size={16}/> : <UserPlus size={16}/>}
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
              {editId ? "Update Member Details" : "Onboard New Member"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all" />
            </div>

            {!editId && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all" />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl outline-none focus:border-indigo-500 font-semibold text-sm transition-all appearance-none">
                <option value="">Select Role</option>
                {roles.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={handleAdd} className={`flex-1 h-[42px] flex items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all shadow-md ${editId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 hover:bg-indigo-600 text-white'}`}>
                {editId ? <Check size={18}/> : <Plus size={18}/>} {editId ? "Update" : "Add Member"}
              </button>
              {editId && (
                <button onClick={resetForm} className="h-[42px] px-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
                  <X size={18}/>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. LIST SECTION */}
      <div className="space-y-3">
        <div className="px-4 py-2 flex text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span className="flex-1">Member Info</span>
          <span className="hidden md:block w-48 text-center">Status</span>
          <span className="w-24 text-right">Actions</span>
        </div>
        
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
            <div className="flex items-center gap-4 flex-1">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm">
                {emp.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{emp.name}</h3>
                <div className="flex gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                  <span className="flex items-center gap-1"><Mail size={10}/> {emp.email}</span>
                  <span className="flex items-center gap-1 text-indigo-500/70"><ShieldCheck size={10}/> {emp.role}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex w-48 justify-center">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100 flex items-center gap-1">
                <BadgeCheck size={12}/> {emp.status}
              </span>
            </div>

            <div className="w-24 flex justify-end gap-1">
              <button onClick={() => { setForm({ name: emp.name, email: emp.email, password: emp.password, role: emp.role }); setEditId(emp.id); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={16}/></button>
              <button onClick={() => handleDelete(emp.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Plus = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);

export default Employees;