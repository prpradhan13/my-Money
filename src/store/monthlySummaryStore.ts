import { create } from "zustand";

interface MonthlySummary {
  month: string;
  total_added: number;
  total_spent: number;
  balance: number;
}

interface MonthlySummaryStore {
  monthlyData: MonthlySummary[];
  setMonthlyData: (data: MonthlySummary[]) => void;
  getMonthlyData: (month: string) => MonthlySummary | undefined;
  getTotalAdded: (month: string) => number;
  getTotalSpent: (month: string) => number;
  getBalance: (month: string) => number;
}

export const useMonthlySummaryStore = create<MonthlySummaryStore>((set, get) => ({
  monthlyData: [],
  setMonthlyData: (data) => set({ monthlyData: data }),
  getMonthlyData: (month) => get().monthlyData.find((item) => item.month === month),
  getTotalAdded: (month) => get().getMonthlyData(month)?.total_added ?? 0,
  getTotalSpent: (month) => get().getMonthlyData(month)?.total_spent ?? 0,
  getBalance: (month) => get().getMonthlyData(month)?.balance ?? 0,
})); 