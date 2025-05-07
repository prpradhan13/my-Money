import { PurchaseDetailsType } from "./purchase.type";

export type UserProfileType = {
  id: string;
  username: string;
  full_name: string;
  emil: string;
  avatar_url: string;
  push_token: string;
};

export type UserBalance = {
  id: number;
  userId: string;
  balance: number;
  created_at: string;
};

export type UserBalanceViewType = {
  userId: string;
  rest_balance: number;
  total_added_money: number;
  total_purchase_amount: number;
  push_token: string;
};

export type UserMonthlySummaryType = {
  user_id: string;
  month: string;
  total_added: number;
  total_spent: number;
  balance: number;
  purchase_items: PurchaseDetailsType[];
}
