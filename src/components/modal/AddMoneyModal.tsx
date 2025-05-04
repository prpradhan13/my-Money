import { useAddedMoneyStore } from "@/src/store/addedMoneyStore";
import useAuthStore from "@/src/store/authStore";
import { UserBalance } from "@/src/types/user.type";
import { successToast } from "@/src/utils/helperFunction";
import { useEnterBalance } from "@/src/utils/query/addedMoneyQuery";
import Feather from "@expo/vector-icons/Feather";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>
              How much money you want to add?
            </Text>
            <TextInput
              keyboardType="numeric"
              value={money}
              onChangeText={(value) => setMoney(value)}
              placeholder="0"
              style={styles.input}
            />

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Feather name="calendar" size={24} />
              <Text style={styles.dateText}>
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

          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              style={styles.saveButton}
            >
              {isPending ? (
                <ActivityIndicator color={"#000"} />
              ) : (
                <Text style={styles.saveButtonText}>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    marginTop: 8,
    fontSize: 36,
  },
  dateButton: {
    marginTop: 16,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    color: '#000',
    fontWeight: '500',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    width: '48.5%',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    width: '48.5%',
  },
  buttonText: {
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
    textAlign: 'center',
  },
});
