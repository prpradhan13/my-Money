import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import useAuthStore from "@/src/store/authStore";
import { useEnterBalance } from "@/src/utils/query/addedMoneyQuery";
import { useQueryClient } from "@tanstack/react-query";
import { UserBalance } from "@/src/types/user.type";
import { successToast } from "@/src/utils/helperFunction";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAddedMoneyStore } from "@/src/store/addedMoneyStore";

interface AddMoneyModalProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
}

const AddMoneyModal = ({
  modalVisible,
  setModalVisible,
}: AddMoneyModalProps) => {
  const [money, setMoney] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { setUserBalance, userBalance } = useAddedMoneyStore();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;
  const { mutate, isPending } = useEnterBalance();

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSave = () => {
    const numericMoney = parseFloat(money);

    if (isNaN(numericMoney) || numericMoney <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const timestamp = selectedDate.toISOString();

    const formData = { balance: numericMoney, created_at: timestamp };

    mutate(formData, {
      onSuccess: (returnedData) => {
        queryClient.setQueryData(
          ["addedMoney", userId],
          (old: UserBalance[]) => {
            return [...(old ?? []), returnedData];
          }
        );

        setUserBalance([...(userBalance ?? []), returnedData]);
        setMoney("");
        setSelectedDate(new Date());
        setModalVisible(false);

        successToast("Balance Added 🎉");
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      onRequestClose={() => setModalVisible(false)}
      animationType="fade"
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-white rounded-lg p-4 ">
          <View className="justify-center items-center">
            <Text className="font-medium text-lg text-center">
              How much money you want to add?
            </Text>
            <TextInput
              keyboardType="numeric"
              value={money}
              onChangeText={(value) => setMoney(value)}
              placeholder="0"
              className="mt-2 text-4xl"
            />

            <Pressable
              onPress={() => setShowDatePicker(true)} // Show the date picker when pressed
              className="mt-4 bg-gray-200 px-4 py-2 rounded-lg flex-row items-center gap-3"
            >
              <Feather name="calendar" size={24} />
              <Text className="text-black font-medium text-lg">
                {dayjs(selectedDate).format("DD MMMM YYYY")}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={() => setModalVisible(false)}
              className="border px-4 py-2 rounded-xl w-[48.5%]"
            >
              <Text className="font-medium text-lg text-center">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              className="bg-black px-4 py-2 rounded-xl w-[48.5%]"
            >
              {isPending ? (
                <ActivityIndicator color={"#000"} />
              ) : (
                <Text className="text-white font-medium text-lg text-center">
                  Save
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddMoneyModal;
