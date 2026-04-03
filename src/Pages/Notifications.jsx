
import { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AppContext } from "../Context/AppContext";
import {
  Bell,
  CheckCircle2,
  ClipboardList,
  User,
  Clock,
  Users,
  Check,
  Eye,
  Info
} from "lucide-react";

const Notifications = () => {
  const { user } = useContext(AppContext);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    let filtered = [];
    if (user?.isAdmin) {
      filtered = res.data;
    } else {
      filtered = res.data.filter((n) => n.userId === user.id);
    }
    setNotifications(filtered);
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const markAsRead = async (id) => {
    await API.patch(`/notifications/${id}`, { read: true });
    fetchNotifications();
  };

  // Logic remains identical
  const taskCompletion = notifications.filter((n) => n.userId === "ADMIN");

  const groupedAssignments = Object.values(
    notifications
      .filter((n) => n.userId !== "ADMIN")
      .reduce((acc, curr) => {
        const key = curr.message;
        if (!acc[key]) {
          acc[key] = { ...curr, members: [] };
        }
        if (curr.receiverName) {
          acc[key].members.push(curr.receiverName);
        }
        return acc;
      }, {})
  );

  const deleteNotification = async (id) => {
    const confirmDelete = confirm("Delete this notification?");
    if (!confirmDelete) return;

    await API.delete(`/notifications/${id}`);
    fetchNotifications();
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen text-slate-800">
      {/* HEADER SECTION */}
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          <Bell className="text-indigo-600" size={32} /> Notifications
        </h1>
        <p className="text-slate-500 font-medium text-sm">Stay updated with the latest project activities</p>
      </header>

      {user?.isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* TASK COMPLETION SECTION */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-emerald-500" size={20} />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
                Task Completion Updates
              </h2>
            </div>

            <div className="space-y-3">
              {taskCompletion.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-sm">
                  No completion updates yet
                </div>
              )}

              {taskCompletion.map((note) => (
                <div key={note.id} className={`p-4 rounded-2xl border transition-all shadow-sm flex justify-between items-center group ${note.read ? "bg-white border-slate-100 opacity-75" : "bg-white border-emerald-200 ring-1 ring-emerald-50"
                  }`}>
                  <div className="flex gap-4 items-start">
                    <div className={`p-2 rounded-xl ${note.read ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-600"}`}>
                      <Check size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${note.read ? "text-slate-600" : "text-slate-900"}`}>{note.message}</p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-slate-400 uppercase">
                        <span className="flex items-center gap-1"><User size={12} /> {note.senderName}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                 
                  <div className="flex items-center gap-2">
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(note.id)}
                       className="px-4 py-1.5 bg-red-500 text-white text-[11px] font-black uppercase rounded-lg hover:bg-red-600 shadow-md transition-all"
                >
                  Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ASSIGNMENTS SECTION */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="text-indigo-500" size={20} />
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-700">
                Assignments & Activity
              </h2>
            </div>

            <div className="space-y-3">
              {groupedAssignments.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 text-sm">
                  No activity recorded
                </div>
              )}

              {groupedAssignments.map((note) => (
                <div key={note.id} className={`p-4 rounded-2xl border transition-all shadow-sm flex justify-between items-center ${note.read ? "bg-white border-slate-100 opacity-75" : "bg-white border-indigo-200 ring-1 ring-indigo-50"
                  }`}>
                  <div className="flex gap-4 items-start">
                    <div className={`p-2 rounded-xl ${note.read ? "bg-slate-100 text-slate-400" : "bg-indigo-100 text-indigo-600"}`}>
                      <Info size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${note.read ? "text-slate-600" : "text-slate-900"}`}>{note.message}</p>
                      {note.members?.length > 0 && (
                        <p className="text-[11px] text-indigo-500 font-bold mt-1 flex items-center gap-1 uppercase">
                          <Users size={12} /> {note.members.join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black rounded uppercase tracking-tighter">{note.type}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  

                  <div className="flex items-center gap-2">
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Eye size={20} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(note.id)}
                       className="px-4 py-1.5 bg-red-500 text-white text-[11px] font-black uppercase rounded-lg hover:bg-red-600 shadow-md transition-all"
                >
                  Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        /* EMPLOYEE VIEW */
        <div className="max-w-3xl mx-auto space-y-4">
          {notifications.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
              <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4 text-slate-300">
                <Bell size={48} />
              </div>
              <p className="text-slate-500 font-bold">No notifications yet!</p>
              <p className="text-slate-400 text-sm">We'll let you know when something happens.</p>
            </div>
          )}

          {notifications.map((note) => (
            <div key={note.id} className={`p-5 rounded-2xl border transition-all shadow-sm flex justify-between items-start ${note.read ? "bg-white border-slate-100 opacity-80" : "bg-white border-indigo-100 ring-1 ring-indigo-50"
              }`}>
              <div className="flex gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${note.read ? "bg-slate-100 text-slate-400" : "bg-amber-100 text-amber-600"
                  }`}>
                  <Bell size={20} />
                </div>
                <div>
                  <p className={`font-bold leading-tight ${note.read ? "text-slate-600" : "text-slate-900"}`}>{note.message}</p>
                  <div className="mt-2 space-y-1">
                    {note.senderName && (
                      <p className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                        <User size={10} /> From: <span className="text-slate-600">{note.senderName}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 italic">
                      <Clock size={10} /> {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            

              <div className="flex flex-col gap-2 shrink-0">
                {!note.read && (
                  <button
                    onClick={() => markAsRead(note.id)}
                    className="px-4 py-1.5 bg-indigo-600 text-white text-[11px] font-black uppercase rounded-lg hover:bg-indigo-700 shadow-md transition-all"
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(note.id)}
                  className="px-4 py-1.5 bg-red-500 text-white text-[11px] font-black uppercase rounded-lg hover:bg-red-600 shadow-md transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;