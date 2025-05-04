import { create } from "zustand";
import { UserBalance } from "../types/user.type";

interface AddedMoney {
  userBalance: UserBalance[] | null;
  userTotalBalance: number;
  monthlyBalance: Record<string, number>;
  setUserBalance: (value: UserBalance[]) => void;
}

export const useAddedMoneyStore = create<AddedMoney>((set) => ({
  userBalance: [],
  userTotalBalance: 0,
  monthlyBalance: {},

  setUserBalance: (balances) => {
    const totalBalance = balances.reduce((acc, item) => acc + item.balance, 0);

    const monthly: Record<string, number> = {};
    balances.forEach((item) => {
      const date = new Date(item.created_at); // assuming UserBalance has created_at
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`; // e.g., "2025-05"
      monthly[key] = (monthly[key] || 0) + item.balance;
    });

    set({
      userBalance: balances,
      userTotalBalance: totalBalance,
      monthlyBalance: monthly,
    });
  },
}));
