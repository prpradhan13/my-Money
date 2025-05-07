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
  id: number;
  userId: string;
  rest_balance: number;
  total_added_money: number;
  total_purchase_amount: number;
  push_token: string;
};

