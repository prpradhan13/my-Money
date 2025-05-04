export type UpcomingBillType = {
    id: string;
    title: string;
    amount: number;
    due_date: string;
    status: string;
    bill_templates: {
        id: string;
        category: string;
    };
}
