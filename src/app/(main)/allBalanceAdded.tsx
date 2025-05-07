import DefaultLoader from "@/src/components/loader/DefaultLoader";
import { formatCurrency } from "@/src/utils/helperFunction";
import { useGetUserAllAddedMoney } from "@/src/utils/query/addedMoneyQuery";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    Modal,
    Pressable,
    SectionList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AllBalanceAdded = () => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { data: userBalance, isLoading: userBalanceLoading } = useGetUserAllAddedMoney();

  const groupedTransactions = useMemo(() => {
    if (!userBalance) return [];

    // Filter transactions by date range if selected
    const filteredTransactions = userBalance.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      if (startDate && transactionDate < startDate) return false;
      if (endDate && transactionDate > endDate) return false;
      return true;
    });

    // Group transactions by date
    const groups = filteredTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.created_at);
        const dateKey = date.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(transaction);
      return acc;
    }, {} as Record<string, any[]>);

    // Convert to array format for SectionList
    return Object.entries(groups)
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([rawDate, transactions]) => ({
        title: new Date(rawDate).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        data: transactions
    }));
  }, [userBalance, startDate, endDate]);

  if (userBalanceLoading) {
    return <DefaultLoader />;
  }

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setShowFilterModal(false);
  };

  const renderTransactionCard = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionCardHeader}>
        <View style={styles.transactionIcon}>
          <Feather name="plus-circle" size={24} color="#4CAF50" />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>
            {item.title || "Credit Transaction"}
          </Text>
          <Text style={styles.transactionTime}>
            {new Date(item.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <View style={styles.transactionAmountContainer}>
          <Text style={styles.transactionAmount}>
            +{formatCurrency(item.balance)}
          </Text>
        </View>
      </View>
      {item.description && (
        <Text style={styles.transactionDescription}>{item.description}</Text>
      )}
    </View>
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Credit History</Text>
        <Pressable
          onPress={() => setShowFilterModal(true)}
          style={styles.filterButton}
        >
          <Feather name="filter" size={24} color="#fff" />
        </Pressable>
      </View>

      <SectionList
        sections={groupedTransactions}
        renderItem={renderTransactionCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="credit-card" size={48} color="#A0A0A0" />
            <Text style={styles.emptyText}>No credit transactions found</Text>
          </View>
        }
        stickySectionHeadersEnabled={true}
      />

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Transactions</Text>
              <Pressable onPress={() => setShowFilterModal(false)}>
                <Feather name="x" size={24} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.dateFilterContainer}>
              <Text style={styles.dateFilterLabel}>Start Date</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {startDate ? startDate.toLocaleDateString() : "Select Date"}
                </Text>
                <Feather name="calendar" size={20} color="#fff" />
              </Pressable>

              <Text style={styles.dateFilterLabel}>End Date</Text>
              <Pressable
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {endDate ? endDate.toLocaleDateString() : "Select Date"}
                </Text>
                <Feather name="calendar" size={20} color="#fff" />
              </Pressable>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </Pressable>
              <Pressable
                style={styles.applyButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {showStartDatePicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default AllBalanceAdded;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#0A0A0A",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: "#0A0A0A",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  sectionHeaderText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  transactionCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionTime: {
    color: "#A0A0A0",
    fontSize: 14,
  },
  transactionAmountContainer: {
    marginLeft: 12,
  },
  transactionAmount: {
    color: "#4CAF50",
    fontSize: 18,
    fontWeight: "600",
  },
  transactionDescription: {
    color: "#A0A0A0",
    fontSize: 14,
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyText: {
    color: "#A0A0A0",
    fontSize: 16,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  dateFilterContainer: {
    gap: 12,
  },
  dateFilterLabel: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 12,
    borderRadius: 12,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
