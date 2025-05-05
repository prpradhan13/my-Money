export type UpcomingBillType = {
    id: string;
    title: string;
    amount: number;
    due_date: string;
    status: string;
    bill_templates: {
        id: string;
        category: string;
        is_recurring: boolean;
    };
}

export type AllCreatedBillsType = {
    id: string;
    user_id: string;
    title: string;
    category: string;
    amount: number;
    day_of_month: number;
    is_recurring: boolean;
    remind_before_days: number;
    note: string;
    created_at: string;
    updated_at: string;
}