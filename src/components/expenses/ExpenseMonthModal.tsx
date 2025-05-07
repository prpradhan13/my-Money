import { useGetUserMonthlySummary } from "@/src/utils/query/userQuery";
import dayjs from "dayjs";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import DefaultLoader from "../loader/DefaultLoader";

interface ExpenseMonthModalProps {
  showMonthPicker: boolean;
  setSelectedMonth: (value: string) => void;
  setShowMonthPicker: (value: boolean) => void;
}

const ExpenseMonthModal = ({
  showMonthPicker,
  setSelectedMonth,
  setShowMonthPicker,
}: ExpenseMonthModalProps) => {

  const { data: userMonthlySummaryData, isLoading: userMonthlySummaryLoading } = useGetUserMonthlySummary();

  if(userMonthlySummaryLoading) return <DefaultLoader />;
    
  return (
    <Modal visible={showMonthPicker} transparent animationType="slide" onRequestClose={() => setShowMonthPicker(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Select Month
          </Text>
          <ScrollView>
            {userMonthlySummaryData?.map(({ month }) => (
              <Pressable
                key={month}
                onPress={() => {
                  setSelectedMonth(month);
                  setShowMonthPicker(false);
                }}
                style={styles.monthItem}
              >
                <Text style={styles.monthText}>
                  {dayjs(month).format("MMMM YYYY")}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable onPress={() => setShowMonthPicker(false)} style={styles.cancelButton}>
            <Text style={styles.cancelText}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ExpenseMonthModal;

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
    width: '75%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  monthItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  monthText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
  cancelButton: {
    marginTop: 16,
  },
  cancelText: {
    textAlign: 'center',
    color: '#ef4444',
    fontWeight: '600',
  },
});
