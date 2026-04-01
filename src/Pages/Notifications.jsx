import { useEffect, useState } from "react";
import API from "../services/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    const res = await API.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    await API.patch(`/notifications/${id}`, { read: true });
    fetchNotifications();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      {notifications.map((note) => (
        <div
          key={note.id}
          className={`p-3 border rounded mb-3 ${
            note.read ? "bg-gray-100" : "bg-yellow-100"
          }`}
        >
          <p>{note.message}</p>

          <div className="flex justify-between mt-2 text-sm">
            <span>{note.type}</span>

            {!note.read && (
              <button
                onClick={() => markAsRead(note.id)}
                className="text-blue-600"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;