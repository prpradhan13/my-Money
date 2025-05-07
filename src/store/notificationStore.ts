import { create } from "zustand";
import { NotificationsType } from "../types/notification.type";

interface NotificationStore {
  notifications: NotificationsType[];
  setNotifications: (notifications: NotificationsType[]) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  setNotifications: (notifications: NotificationsType[]) => set({ notifications }),
}));

export default useNotificationStore;

