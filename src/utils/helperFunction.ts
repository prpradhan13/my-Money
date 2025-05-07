import Toast from "react-native-toast-message";
import { PurchaseDetailsType, TCategoryItems } from "../types/purchase.type";
import dayjs from "dayjs";

export const getInitialLetter = (fullName?: string) => {
  if (!fullName) return "";
  const nameParts = fullName.split(" ");
  return nameParts.length === 1
    ? fullName.slice(0, 2).toUpperCase()
    : nameParts
        .map((name: string) => name[0])
        .join("")
        .toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
  if(!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const errorToast = (errorMessage: string) => {
  Toast.show({
    type: "error",
    text1: errorMessage,
    position: "bottom",
  });
};

export const successToast = (successMessage: string) => {
  Toast.show({
    type: "success",
    text1: successMessage,
    position: "top",
  });
};

export const infoToast = (infoMessage: string) => {
  Toast.show({
    type: "info",
    text1: infoMessage,
    position: "bottom",
  });
};

export const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const formatCurrency = (value: number, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const groupObjectReducer = (
  acc: Record<string, PurchaseDetailsType[]>,
  expense: PurchaseDetailsType
) => {
  const monthKey = getMonthKey(new Date(expense.created_at));

  if (!acc[monthKey]) {
    acc[monthKey] = [];
  }

  acc[monthKey].push(expense);
  return acc;
};

export const grpByCategoryReducer = (
  acc: Record<string, TCategoryItems[]>,
  expense: PurchaseDetailsType
) => {
  const categoryKey = expense.category || "Uncategorized";

  const item: TCategoryItems = {
    item_name: expense.item_name,
    price: expense.total,
    created_at: expense.created_at,
  };

  if (!acc[categoryKey]) {
    acc[categoryKey] = [];
  }

  acc[categoryKey].push(item);

  return acc;
};

export const groupedExpensesFunc = (
  expenseQueryData: PurchaseDetailsType[] | null
) => {
  if (!expenseQueryData) return [];

  const grpObject = expenseQueryData.reduce<
    Record<string, typeof expenseQueryData>
  >(groupObjectReducer, {});

  return Object.entries(grpObject)
    .sort(([a], [b]) => (dayjs(b).isAfter(dayjs(a)) ? 1 : -1))
    .map(([month, expenses]) => ({
      month,
      expenses,
    }));
};
