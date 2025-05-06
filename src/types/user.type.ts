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
