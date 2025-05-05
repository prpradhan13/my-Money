import DefaultLoader from "@/src/components/loader/DefaultLoader";
import { categoryData } from "@/src/constants/Colors";
import { formatCurrency } from "@/src/utils/helperFunction";
import { useDeleteBill, useGetAllCreatedBills } from "@/src/utils/query/upcomingBillQuery";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const AllCreatedBillsScreen = () => {
  const { data, isLoading } = useGetAllCreatedBills();
  const { mutate: deleteBill } = useDeleteBill();

  if (isLoading) {
    return <DefaultLoader />;
  }

  if (data?.length === 0) {
    return (
      <View style={styles.noBillsContainer}>
        <Feather name="file-text" size={48} color="#9ca3af" />
        <Text style={styles.noBillsText}>No bills created</Text>
        <Text style={styles.noBillsSubtext}>
          Create your first bill to get started
        </Text>
      </View>
    );
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = categoryData.find((cat) => cat.cName === categoryName);
    if (!category?.iconComponent) return null;
    return React.createElement(category.iconComponent, {
      ...category.iconProps,
      name: category.iconProps.name as any,
      color: "#fff",
    });
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categoryData.find((cat) => cat.cName === categoryName);
    return category?.color || "#9ca3af";
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const categoryColor = getCategoryColor(item.category);
          const CategoryIcon = getCategoryIcon(item.category);

          return (
            <View style={styles.billContainer}>
              <View style={styles.billHeader}>
                <View style={styles.categoryContainer}>
                  <View
                    style={[
                      styles.categoryIconContainer,
                      { backgroundColor: categoryColor },
                    ]}
                  >
                    {CategoryIcon}
                  </View>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <View style={styles.recurringContainer}>
                  {item.is_recurring ? (
                    <View style={styles.recurringBadge}>
                      <Feather name="repeat" size={14} color="#3b82f6" />
                      <Text style={styles.recurringText}>Recurring</Text>
                    </View>
                  ) : (
                    <View style={styles.oneTimeBadge}>
                      <Feather name="clock" size={14} color="#9ca3af" />
                      <Text style={styles.oneTimeText}>One-time</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.billContent}>
                <Text style={styles.billTitle}>{item.title}</Text>
                <Text style={styles.billAmount}>
                  {formatCurrency(item.amount)}
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>
                    /month
                  </Text>
                </Text>
              </View>

              <View style={styles.billFooter}>
                <View style={styles.dateContainer}>
                  <Feather name="calendar" size={16} color="#9ca3af" />
                  <Text style={styles.dateText}>
                    {item.is_recurring
                      ? `Every month on day ${item.day_of_month}`
                      : `Due on day ${item.day_of_month}`}
                  </Text>
                </View>
                <View style={styles.footerRight}>
                  <View style={styles.reminderContainer}>
                    <Feather name="bell" size={16} color="#9ca3af" />
                    <Text style={styles.reminderText}>
                      Remind {item.remind_before_days} days before
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => deleteBill(item.id)}
                  >
                    <Feather name="trash-2" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AllCreatedBillsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  noBillsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
    gap: 12,
  },
  noBillsText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  noBillsSubtext: {
    color: "#9ca3af",
    fontSize: 14,
  },
  billContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  billHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  recurringContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  recurringBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  recurringText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "500",
  },
  oneTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  oneTimeText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "500",
  },
  billContent: {
    gap: 8,
  },
  billTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  billAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  billFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reminderText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 8,
  },
});
