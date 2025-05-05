import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import dayjs from "dayjs";
import { categoryData } from "@/src/constants/Colors";
import { formatCurrency } from "@/src/utils/helperFunction";
import { Link } from "expo-router";

const BillFlatList = ({ bills }: { bills: UpcomingBillType[] }) => {

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignContent: "center" }}>
        <Text style={styles.title}>Upcoming Bills</Text>
        <Link href={"/bills"} asChild>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            View All
          </Text>
        </Link>
      </View>

      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const cData = categoryData.find(
            (c) => c.cName === item.bill_templates.category
          ) || {
            color: "#9ca3af",
            iconComponent: null,
            iconProps: {},
          };

          const IconComponent = cData.iconComponent;
          const due_date = dayjs(item.due_date).format("DD MMM YYYY");

          return (
            <View style={styles.billContainer}>
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

                <View>
                  <Text style={styles.billTitle}>{item.title}</Text>
                  <Text style={styles.billDueDate}>{due_date}</Text>
                </View>
              </View>
              <Text style={styles.billAmount}>
                {formatCurrency(item.amount)}/m
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default BillFlatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 6,
    marginBottom: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  flatListContainer: {
    gap: 16,
  },
  billContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  billInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    borderRadius: 999,
    backgroundColor: "#000",
    padding: 10,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textTransform: "capitalize",
  },
  billDueDate: {
    fontSize: 12,
    color: "#000",
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});
