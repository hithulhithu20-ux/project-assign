import API from "./api";

export const createNotification = async (data) => {
  await API.post("/notifications", data);
};