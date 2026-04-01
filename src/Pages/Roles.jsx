import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContext";


const modules = ["Roles", "Employees", "Projects", "Tasks", "Notifications"];
const actions = ["view", "create", "edit", "delete"];

const Roles = () => {
  const { roles, addRole } = useContext(AppContext);

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

  const handleAddRole = async () => {
    if (!roleName) {
      alert("Enter role name");
      return;
    }

    await addRole({
      name: roleName,
      permissions,
    });

    setRoleName("");
    setPermissions({});
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Roles</h1>

      {/* Form */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-3">Create Role</h2>

        <input
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          placeholder="Role Name"
          className="border px-3 py-2 rounded mb-4 w-60"
        />

        {/* Permissions */}
        <div className="space-y-3">
          {modules.map((module) => (
            <div key={module} className="flex items-center gap-4">
              <span className="w-32 font-medium">{module}</span>

              {actions.map((action) => (
                <label key={action} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={permissions[module]?.[action] || false}
                    onChange={() =>
                      handlePermissionChange(module, action)
                    }
                  />
                  {action}
                </label>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={handleAddRole}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Add Role
        </button>
      </div>

      {/* Roles List */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Roles List</h2>

        {roles.length === 0 && (
          <p className="text-gray-500">No roles created</p>
        )}

        {roles.map((role) => (
          <div key={role.id} className="border p-3 rounded mb-3">
            <h3 className="font-bold">{role.name}</h3>

            <div className="text-sm mt-2">
              {Object.keys(role.permissions || {}).map((mod) => (
                <div key={mod}>
                  <span className="font-medium">{mod}: </span>
                  {Object.keys(role.permissions[mod])
                    .filter((a) => role.permissions[mod][a])
                    .join(", ")}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roles;