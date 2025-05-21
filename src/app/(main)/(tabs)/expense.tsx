import CategoryItems from "@/src/components/expenses/CategoryItems";
import { DonutChart } from "@/src/components/expenses/DonutChart";
import ExpenseMonthModal from "@/src/components/expenses/ExpenseMonthModal";
import WeeklyBarChart from "@/src/components/expenses/WeeklyBarChart";
import DefaultLoader from "@/src/components/loader/DefaultLoader";
import useAuthStore from "@/src/store/authStore";
import { useMonthlySummaryStore } from "@/src/store/monthlySummaryStore";
import { useTransactionStore } from "@/src/store/transactionStore";
import { TCategoryItems } from "@/src/types/purchase.type";
import {
  formatCurrency,
  grpByCategoryReducer,
} from "@/src/utils/helperFunction";
import { useGetUserMonthlySummary } from "@/src/utils/query/userQuery";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExpenseScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [balanceView, setBalanceView] = useState<"monthly" | "remaining">(
    "monthly"
  );

  const { user } = useAuthStore();
  const { allExpenses: expenseQueryData } = useTransactionStore();
  const userId = user?.id;
  const isLoading = !userId || expenseQueryData === undefined;

  const { data: userMonthlySummaryData, isLoading: userMonthlySummaryLoading, refetch: refetchUserMonthlySummary } = useGetUserMonthlySummary();
  const { setMonthlyData } = useMonthlySummaryStore();

  useEffect(() => {
    if (userMonthlySummaryData && !selectedMonth) {
      setSelectedMonth(userMonthlySummaryData[0].month);
    }
  }, [userMonthlySummaryData, selectedMonth]);

  useEffect(() => {
    if (userMonthlySummaryData) {
      setMonthlyData(userMonthlySummaryData);
    }
  }, [setMonthlyData, userMonthlySummaryData]);

  const monthlyData = useMemo(() => {
    return userMonthlySummaryData?.find((d) => {
      const monthKey = new Date(d.month);
      return monthKey.getMonth() === new Date(selectedMonth).getMonth();
    });
  }, [userMonthlySummaryData, selectedMonth]);
  

  const balanceForMonth = monthlyData?.total_added ?? 0;
  const remainingBalance = monthlyData?.balance ?? 0;
  const totalSpend = monthlyData?.total_spent ?? 0;

  // showBalance depends on toggle
  const [showBalance, setShowBalance] = useState(0);

  useEffect(() => {
    if (balanceView === "monthly") {
      setShowBalance(balanceForMonth);
    } else {
      setShowBalance(remainingBalance);
    }
  }, [balanceView, balanceForMonth, remainingBalance]);

  const filteredExpenses = userMonthlySummaryData?.find((expense) => expense.month === selectedMonth)

  const grpByCategory = useMemo(() => {
    return filteredExpenses?.purchase_items.reduce<Record<string, TCategoryItems[]>>(
      grpByCategoryReducer,
      {}
    );
  }, [filteredExpenses]);

  const categoryArray = Object.entries(grpByCategory ?? {}).map(
    ([category, items]) => ({
      category,
      items,
    })
  );

  const weeklyBarData = filteredExpenses?.purchase_items.map((e) => ({
    price: e.total,
    created_at: e.created_at,
  }));

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchUserMonthlySummary();
    setRefreshing(false);
  };

  if (isLoading || userMonthlySummaryLoading || !selectedMonth)
    return <DefaultLoader />;

  if (!expenseQueryData || expenseQueryData.length === 0) {
    return (
      <View style={styles.noTransactionsContainer}>
        <Text style={styles.noTransactionsText}>No Transactions</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.monthSelector}>
              <Pressable
                onPress={() => setShowMonthPicker(true)}
                style={styles.monthButton}
              >
                <Text style={styles.yearText}>
                  {dayjs(selectedMonth).format("YYYY")}
                </Text>
                <Text style={styles.monthText}>
                  {dayjs(selectedMonth).format("MMMM")}
                </Text>
                <Feather name="chevron-down" size={20} color="#A0A0A0" />
              </Pressable>
            </View>

            <View style={styles.balanceContainer}>
              <View style={styles.balanceToggle}>
                <Pressable
                  onPress={() => {
                    setBalanceView("monthly");
                    setShowBalance(balanceForMonth);
                  }}
                  style={[
                    styles.toggleButton,
                    balanceView === "monthly" && styles.toggleButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      balanceView === "monthly" && styles.toggleTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setBalanceView("remaining");
                    setShowBalance(remainingBalance);
                  }}
                  style={[
                    styles.toggleButton,
                    balanceView === "remaining" && styles.toggleButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      balanceView === "remaining" && styles.toggleTextActive,
                    ]}
                  >
                    Remaining
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.balanceAmount}>
                {formatCurrency(showBalance)}
              </Text>
            </View>
          </View>

          <View style={styles.headerBottom}>
            <View style={styles.chartContainer}>
              <DonutChart
                total={balanceForMonth}
                spent={totalSpend}
                radius={28}
                strokeWidth={10}
              />
              <View style={styles.chartInfo}>
                <Text style={styles.chartLabel}>Spent</Text>
                <Text style={styles.chartValue}>
                  {formatCurrency(totalSpend)}
                </Text>
              </View>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total Budget</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(balanceForMonth)}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Remaining</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(remainingBalance)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <WeeklyBarChart data={weeklyBarData ?? []} />

        <View>
          <Text style={styles.sectionTitle}>Categories</Text>
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

      {showMonthPicker && (
        <ExpenseMonthModal
          setSelectedMonth={setSelectedMonth}
          setShowMonthPicker={setShowMonthPicker}
          showMonthPicker={showMonthPicker}
        />
      )}
    </SafeAreaView>
  );
};

export default ExpenseScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  headerContainer: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  headerBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthSelector: {
    flex: 1,
  },
  monthButton: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  yearText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
  },
  monthText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  balanceContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  balanceToggle: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: "#3A3A3A",
  },
  toggleText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#fff",
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  chartInfo: {
    alignItems: "center",
    marginTop: 8,
  },
  chartLabel: {
    color: "#A0A0A0",
    fontSize: 12,
    fontWeight: "500",
  },
  chartValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  summaryContainer: {
    flex: 1,
    marginLeft: 20,
  },
  summaryItem: {
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 16,
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
});
