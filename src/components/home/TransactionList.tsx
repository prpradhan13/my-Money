import { View, Text } from "react-native";
import React from "react";
import dayjs from "dayjs";
import { PurchaseDetailsType } from "@/src/types/purchase.type";
import { categoryData } from "@/src/constants/Colors";
import { formatCurrency } from "@/src/utils/helperFunction";

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
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center gap-5">
        <View className="rounded-full">
          {IconComponent && (
            <IconComponent
              {...cData.iconProps}
              name={cData.iconProps?.name as any}
              color={cData.color}
            />
          )}
        </View>

        <View className="w-[69%]">
          <Text className="text-white text-xl font-medium capitalize">
            {transaction.item_name}
          </Text>
          <Text className="text-[#c2c2c2]">{transactionDate}</Text>
        </View>
      </View>

      <Text className="text-white text-lg font-medium">
        -{formatCurrency(transaction.total)}
      </Text>
    </View>
  );
};

export default TransactionList;
