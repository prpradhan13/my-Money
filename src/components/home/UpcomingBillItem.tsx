import { categoryData } from "@/src/constants/Colors";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import { formatCurrency } from "@/src/utils/helperFunction";
import {
  useMarkBillAsPaid,
  useStopBill,
} from "@/src/utils/query/upcomingBillQuery";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const UpcomingBillItem = ({ bill }: { bill: UpcomingBillType }) => {
  const { mutate: markBillAsPaid } = useMarkBillAsPaid();
  const { mutate: stopBill } = useStopBill();

  const cData = categoryData.find(
    (c) => c.cName === bill.bill_templates.category
  ) || {
    color: "#9ca3af",
    iconComponent: null,
    iconProps: {},
  };

  const IconComponent = cData.iconComponent;

  const handleMarkAsPaid = () => {
    markBillAsPaid(bill.id);
  };

  const handleStopBill = () => {
    Alert.alert(
      "Stop Bill",
      "Are you sure you want to stop this bill? This will stop all future occurrences of this bill.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: () => stopBill(bill.id),
        },
      ]
    );
  };

  return (
    <View style={styles.billCard}>
      <View style={styles.billHeader}>
        <View style={styles.categoryContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: cData.color + "20" },
            ]}
          >
            {IconComponent && (
              <IconComponent
                {...cData.iconProps}
                name={cData.iconProps?.name as any}
                color={cData.color}
              />
            )}
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryText}>
              {bill.bill_templates.category}
            </Text>
            <Text style={styles.dateText}>
              {dayjs(bill.due_date).format("DD MMM YYYY")}
            </Text>
          </View>
        </View>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{formatCurrency(bill.amount)}</Text>
        </View>
      </View>

      <View style={styles.billContent}>
        <Text style={styles.billTitle}>{bill.title}</Text>
        {bill.bill_templates.is_recurring && (
          <View style={styles.recurringBadge}>
            <Feather name="repeat" size={14} color="#3b82f6" />
            <Text style={styles.recurringText}>Recurring</Text>
          </View>
        )}
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.button, styles.paidButton]}
          onPress={handleMarkAsPaid}
        >
          <Feather name="check-circle" size={16} color="#fff" />
          <Text style={styles.buttonText}>Mark as Paid</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.stopButton]}
          onPress={handleStopBill}
        >
          <Feather name="x-circle" size={16} color="#fff" />
          <Text style={styles.buttonText}>Stop</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UpcomingBillItem;

const styles = StyleSheet.create({
  billCard: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryInfo: {
    gap: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  dateText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
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
  recurringBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 4,
  },
  recurringText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  paidButton: {
    backgroundColor: "#10b981",
  },
  stopButton: {
    backgroundColor: "#ef4444",
  },
  stopRecurringButton: {
    backgroundColor: "#f59e0b",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
