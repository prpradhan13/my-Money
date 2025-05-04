import BalanceDropdown from "@/src/components/expenses/BalanceDropdown";
import CategoryItems from "@/src/components/expenses/CategoryItems";
import { DonutChart } from "@/src/components/expenses/DonutChart";
import ExpenseMonthModal from "@/src/components/expenses/ExpenseMonthModal";
import WeeklyBarChart from "@/src/components/expenses/WeeklyBarChart";
import DefaultLoader from "@/src/components/loader/DefaultLoader";
import { _layout, AnimatedPressable } from "@/src/constants/Animation";
import { useAddedMoneyStore } from "@/src/store/addedMoneyStore";
import useAuthStore from "@/src/store/authStore";
import { useTransactionStore } from "@/src/store/transactionStore";
import { TCategoryItems } from "@/src/types/purchase.type";
import {
  formatCurrency,
  getMonthKey,
  groupedExpensesFunc,
  grpByCategoryReducer,
} from "@/src/utils/helperFunction";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const ExpenseScreen = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [openBalanceCategoryBox, setOpenBalanceCategoryBox] = useState(false);

  const { user } = useAuthStore();
  const { monthlyBalance } = useAddedMoneyStore();
  const { allExpenses: expenseQueryData } = useTransactionStore();

  const balanceForMonth =
    (selectedMonth && monthlyBalance?.[selectedMonth]) || 0;

  const [showBalance, setShowBalance] = useState(balanceForMonth);

  const userId = user?.id;
  const isLoading = !userId || expenseQueryData === undefined;

  // Group expenses by month
  const groupedExpenses = useMemo(
    () => groupedExpensesFunc(expenseQueryData),
    [expenseQueryData]
  );

  useEffect(() => {
    if (groupedExpenses.length > 0 && !selectedMonth) {
      setSelectedMonth(groupedExpenses[0].month);
    }
  }, [groupedExpenses, selectedMonth]);

  useEffect(() => {
    if (selectedMonth) {
      setShowBalance(balanceForMonth);
    }
  }, [selectedMonth, balanceForMonth]);

  const filteredExpenses = useMemo(() => {
    if (!expenseQueryData || !selectedMonth) return [];

    return expenseQueryData.filter((expense) => {
      const expenseMonth = getMonthKey(new Date(expense.created_at));
      return expenseMonth === selectedMonth;
    });
  }, [expenseQueryData, selectedMonth]);

  const grpByCategory = filteredExpenses.reduce<
    Record<string, TCategoryItems[]>
  >(grpByCategoryReducer, {});

  const categoryArray = Object.entries(grpByCategory).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  const totalSpend = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (e.total || 0), 0);
  }, [filteredExpenses]);

  const remainingBalance = balanceForMonth - totalSpend;

  const weeklyBarData = filteredExpenses.map((e) => ({
    price: e.total,
    created_at: e.created_at,
  }));

  if (isLoading || (groupedExpenses.length > 0 && !selectedMonth))
    return <DefaultLoader />;

  if (!expenseQueryData || expenseQueryData.length === 0) {
    return (
      <View style={styles.noTransactionsContainer}>
        <Text style={styles.noTransactionsText}>No Transactions</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Pressable onPress={() => setShowMonthPicker(true)}>
            <Text style={styles.yearText}>
              {dayjs(selectedMonth).format("YYYY")}
            </Text>
            <Text style={styles.monthText}>
              {dayjs(selectedMonth).format("MMMM")}
            </Text>
          </Pressable>

          <View style={styles.balanceContainer}>
            <Animated.View layout={_layout}>
              <AnimatedPressable
                onPress={() => setOpenBalanceCategoryBox((prev) => !prev)}
                style={styles.balanceButton}
              >
                <Text style={styles.balanceAmount}>
                  {formatCurrency(showBalance)}
                </Text>
                <View style={styles.balanceLabelContainer}>
                  <Text style={styles.balanceLabel}>This month</Text>
                  <Feather name="chevron-down" color={"#c2c2c2"} size={14} />
                </View>
              </AnimatedPressable>
            </Animated.View>

            {openBalanceCategoryBox && (
              <BalanceDropdown
                monthlyBalance={balanceForMonth}
                remainingBalance={remainingBalance}
                setShowBalance={setShowBalance}
                closeDropdown={() => setOpenBalanceCategoryBox(false)}
              />
            )}
          </View>

          <DonutChart
            total={balanceForMonth}
            spent={totalSpend}
            radius={23}
            strokeWidth={8}
          />
        </View>

        <WeeklyBarChart data={weeklyBarData} />

        <View style={styles.categoriesContainer}>
          {categoryArray.map((c, index) => (
            <CategoryItems
              key={index}
              category={c.category}
              items={c.items}
              month={selectedMonth}
            />
          ))}
        </View>
      </ScrollView>

      <View>
        {showMonthPicker && (
          <ExpenseMonthModal
            groupedExpenses={groupedExpenses}
            setSelectedMonth={setSelectedMonth}
            setShowMonthPicker={setShowMonthPicker}
            showMonthPicker={showMonthPicker}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTransactionsText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  yearText: {
    color: "#c2c2c2",
    fontWeight: "600",
  },
  monthText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 24,
  },
  balanceContainer: {
    position: "relative",
    alignItems: "center",
  },
  balanceButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  balanceLabelContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  balanceLabel: {
    color: "#c2c2c2",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesContainer: {
    marginTop: 24,
    gap: 8,
  },
});
