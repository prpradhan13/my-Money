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
  KeyboardAvoidingView,
  Modal,
  Platform,
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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["addedMoney", userId] });
        queryClient.invalidateQueries({ queryKey: ["user_balances", userId] });
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Add Money</Text>
            <Text style={styles.subtitle}>Enter the amount you want to add</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                keyboardType="numeric"
                value={money}
                onChangeText={(value) => setMoney(value)}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <Pressable
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
            >
              <Feather name="calendar" size={20} color="#4B5563" />
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
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              style={[styles.saveButton, isPending && styles.saveButtonDisabled]}
            >
              {isPending ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Add Money</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMoneyModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 8,
    marginBottom: 24,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  input: {
    fontSize: 36,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    padding: 0,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginBottom: 24,
  },
  dateText: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
