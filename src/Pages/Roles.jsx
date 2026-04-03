
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { hasPermission } from "../utils/Permissions";
import { 
  ShieldCheck, 
  Plus, 
  Settings, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Lock, 
  Layout 
} from "lucide-react";

const modules = ["Roles", "Employees", "Projects", "Tasks", "Notifications"];
const actions = ["view", "create", "edit", "delete"];

const Roles = () => {
  const { roles, addRole, updateRole, deleteRole, user } = useContext(AppContext);
  const [editId, setEditId] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});

  const handlePermissionChange = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action],
      },
    }));
  };

  const handleEdit = (role) => {
    setRoleName(role.name);
    setPermissions(role.permissions);
    setEditId(role.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this role?")) {
      await deleteRole(id);
    }
  };

  const resetForm = () => {
    setRoleName("");
    setPermissions({});
    setEditId(null);
  };

  const handleSaveRole = async () => {
    if (!roleName) return alert("Enter role name");

    if (editId) {
      await updateRole(editId, { name: roleName, permissions });
    } else {
      await addRole({ name: roleName, permissions });
    }
    resetForm();
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* 1. HEADER SECTION */}
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-indigo-600" size={32} /> Role Management
        </h1>
        <p className="text-slate-500 font-medium text-sm">Define access levels and module permissions</p>
      </header>

      {/* 2. CREATE/EDIT SECTION */}
      {hasPermission(user, "Roles", "create") && (
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 transition-all">
          <div className="flex items-center gap-2 mb-6">
            <div className={`p-1.5 rounded-lg ${editId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {editId ? <Edit3 size={16} /> : <Plus size={16} />}
            </div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
              {editId ? "Modify Role Permissions" : "Configure New Role"}
            </h2>
          </div>

          <div className="space-y-6">
            <div className="max-w-md space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role Identifier</label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Project Manager"
                className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 font-semibold text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => (
                <div key={module} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3 border-b border-slate-200 pb-2">
                    <Layout size={14} className="text-slate-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-600">{module}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => {
                      const isActive = permissions[module]?.[action];
                      return (
                        <button
                          key={action}
                          onClick={() => handlePermissionChange(module, action)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase transition-all flex items-center gap-1.5 border ${
                            isActive 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                              : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300'
                          }`}
                        >
                          {isActive ? <Check size={12} /> : <div className="w-3" />}
                          {action}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSaveRole}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center gap-2 ${
                  editId ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-900 hover:bg-indigo-600 text-white'
                }`}
              >
                {editId ? <Check size={18} /> : <Plus size={18} />}
                {editId ? "Update Permissions" : "Create Role"}
              </button>
              {editId && (
                <button 
                  onClick={resetForm}
                  className="px-4 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 font-bold text-sm"
                >
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. ROLES LIST SECTION */}
      {hasPermission(user, "Roles", "view") && (
        <div className="space-y-4">
          <div className="px-4 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Roles & Permissions</h2>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md">Total: {roles.length}</span>
          </div>

          {roles.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <p className="text-slate-400 font-medium italic">No security roles defined yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <Lock size={18} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 text-lg leading-tight">{role.name}</h3>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System Role</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {hasPermission(user, "Roles", "edit") && (
                        <button onClick={() => handleEdit(role)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit3 size={16} /></button>
                      )}
                      {hasPermission(user, "Roles", "delete") && (
                        <button onClick={() => handleDelete(role.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.keys(role.permissions || {}).map((mod) => {
                      const activeActions = Object.keys(role.permissions[mod]).filter((a) => role.permissions[mod][a]);
                      if (activeActions.length === 0) return null;
                      
                      return (
                        <div key={mod} className="flex items-center gap-2">
                          <span className="w-20 text-[10px] font-black text-slate-400 uppercase tracking-tighter">{mod}</span>
                          <div className="flex flex-wrap gap-1">
                            {activeActions.map(action => (
                              <span key={action} className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase border border-emerald-100">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Roles;