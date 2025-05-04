export type PurchaseDetailsType = {
  id: string;
  user_id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
  total: number;
  created_at: string;
};

export type MonthExpenseType = {
  month: string;
  expenses: PurchaseDetailsType[];
};

export type TCategoryItems = {
  item_name: string;
  price: number;
  created_at: string;
};
