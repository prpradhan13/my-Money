import { View, Text, Modal, ScrollView, Pressable } from "react-native";
import React from "react";
import { MonthExpenseType } from "@/src/types/purchase.type";
import dayjs from "dayjs";

interface ExpenseMonthModalProps {
  showMonthPicker: boolean;
  groupedExpenses: MonthExpenseType[];
  setSelectedMonth: (value: string) => void;
  setShowMonthPicker: (value: boolean) => void;
}

const ExpenseMonthModal = ({
  groupedExpenses,
  showMonthPicker,
  setSelectedMonth,
  setShowMonthPicker,
}: ExpenseMonthModalProps) => {
    
  return (
    <Modal visible={showMonthPicker} transparent animationType="slide" onRequestClose={() => setShowMonthPicker(false)}>
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-white rounded-lg p-4 w-3/4 max-h-[60%]">
          <Text className="text-xl font-semibold mb-4 text-center">
            Select Month
          </Text>
          <ScrollView>
            {groupedExpenses.map(({ month }) => (
              <Pressable
                key={month}
                onPress={() => {
                  setSelectedMonth(month);
                  setShowMonthPicker(false);
                }}
                className="py-2 border-b border-gray-300"
              >
                <Text className="text-center text-lg text-black">
                  {dayjs(month).format("MMMM YYYY")}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable onPress={() => setShowMonthPicker(false)} className="mt-4">
            <Text className="text-center text-red-500 font-semibold">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ExpenseMonthModal;
