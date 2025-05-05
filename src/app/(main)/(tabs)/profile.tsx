import CreateUpcomingBill from "@/src/components/modal/CreateUpcomingBill";
import useAuthStore from "@/src/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const [isCreateUpcomingBillVisible, setIsCreateUpcomingBillVisible] = useState(false);
  const { logout } = useAuthStore()

  const handleLogOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogOut}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>

      <Pressable onPress={() => router.push('/createExpenseModal')} style={styles.button}>
        <Text style={styles.buttonText}>Add Expense</Text>
      </Pressable>

      <Pressable onPress={() => setIsCreateUpcomingBillVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Set Upcoming Bill</Text>
      </Pressable>

      <CreateUpcomingBill isVisible={isCreateUpcomingBillVisible} setIsVisible={setIsCreateUpcomingBillVisible} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
  },
});