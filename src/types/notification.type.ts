export type NotificationsType = {
    id: string;
    user_id: string;
    title: string;
    description: string;
    read: boolean;
    created_at: string;
    type: "success" | "warning" | "info";
}
