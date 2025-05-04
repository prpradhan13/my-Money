import { create } from "zustand";
import { PurchaseDetailsType } from "@/src/types/purchase.type";

interface UserTransactions {
  allExpenses: PurchaseDetailsType[] | null;
  userAllTransactionAmount: number;
  setAllExpenses: (expenses: PurchaseDetailsType[]) => void;
}

export const useTransactionStore = create<UserTransactions>((set) => ({
  allExpenses: null,
  userAllTransactionAmount: 0,
  setAllExpenses: (expenses) => {
    const sortExpense = expenses.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    const amount = expenses.reduce(
      (acc, transaction) => acc + (transaction.total || 0),
      0
    );

    set({
      allExpenses: sortExpense,
      userAllTransactionAmount: amount,
    });
  },
}));
