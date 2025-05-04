import { categoryData } from "@/src/constants/Colors";
import { PurchaseDetailsType } from "@/src/types/purchase.type";
import { formatCurrency } from "@/src/utils/helperFunction";
import dayjs from "dayjs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TransactionListProps {
  transaction: PurchaseDetailsType;
}

const TransactionList = ({ transaction }: TransactionListProps) => {
  const transactionDate = dayjs(transaction.created_at).format("DD MMMM YY");
  const cData = categoryData.find((c) => c.cName === transaction.category) || {
    color: "#9ca3af",
    iconComponent: null,
    iconProps: {},
  };

  const IconComponent = cData.iconComponent;

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>
          {IconComponent && (
            <IconComponent
              {...cData.iconProps}
              name={cData.iconProps?.name as any}
              color={cData.color}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.itemName}>
            {transaction.item_name}
          </Text>
          <Text style={styles.date}>
            {transactionDate}
          </Text>
        </View>
      </View>

      <Text style={styles.amount}>
        -{formatCurrency(transaction.total)}
      </Text>
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    borderRadius: 999,
  },
  textContainer: {
    width: '69%',
  },
  itemName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  date: {
    color: '#c2c2c2',
  },
  amount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
