import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import React from "react";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import {
  useMarkBillAsPaid,
  useStopRecurringBill,
} from "@/src/utils/query/upcomingBillQuery";
import { formatCurrency } from "@/src/utils/helperFunction";
import dayjs from "dayjs";
import { categoryData } from "@/src/constants/Colors";

const UpcomingBillItem = ({ bill }: { bill: UpcomingBillType }) => {
  const { mutate: markBillAsPaid } = useMarkBillAsPaid();
  const { mutate: stopRecurring } = useStopRecurringBill();

  const cData = categoryData.find(
    (c) => c.cName === bill.bill_templates.category
  ) || {
    color: "#9ca3af",
    iconComponent: null,
    iconProps: {},
  };

  const IconComponent = cData.iconComponent;

  return (
    <View style={styles.billCard}>
      <View style={styles.billInfoContainer}>
        <View style={styles.iconContainer}>
          {IconComponent && (
            <IconComponent
              {...cData.iconProps}
              name={cData.iconProps?.name as any}
              color={cData.color}
            />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              textTransform: "capitalize",
              color: "#fff",
            }}
          >
            {bill.title}
          </Text>
          <Text style={{ color: "#fff" }}>
            {dayjs(bill.due_date).format("DD MMM YYYY")}
          </Text>
        </View>

          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            {formatCurrency(bill.amount)}
          </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable
          style={styles.button}
          onPress={() => markBillAsPaid(bill.id)}
        >
          <Text style={{ color: "#fff" }}>Mark as Paid</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() =>
            Alert.alert("Stop recurring?", "This will stop future bills.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Stop",
                onPress: () => stopRecurring(bill.bill_templates.id),
              },
            ])
          }
        >
          <Text style={{ color: "#fff" }}>Stop</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UpcomingBillItem;

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: 999,
    backgroundColor: "#000",
    padding: 10,
  },
  billInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  billCard: {
    padding: 16,
    backgroundColor: "#595959",
    borderRadius: 8,
    marginBottom: 12,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
  },
});
