import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
  icon: keyof typeof Ionicons.glyphMap;
  read: boolean;
}

// Mock data for notifications
const notifications: Notification[] = [
  {
    id: "1",
    title: "Transaction Successful",
    message: "Your payment of $50.00 to John Doe was successful",
    time: "2 hours ago",
    type: "success",
    icon: "checkmark-circle",
    read: false,
  },
  {
    id: "2",
    title: "Low Balance Alert",
    message: "Your account balance is below $100",
    time: "5 hours ago",
    type: "warning",
    icon: "warning",
    read: false,
  },
  {
    id: "3",
    title: "New Feature Available",
    message: "Check out our new budgeting tools",
    time: "1 day ago",
    type: "info",
    icon: "information-circle",
    read: true,
  },
];

const NotificationItem = ({
  notification,
  index,
}: {
  notification: Notification;
  index: number;
}) => {
  const { colors } = useTheme();

  const getIconColor = () => {
    switch (notification.type) {
      case "success":
        return "#4CAF50";
      case "warning":
        return "#FFC107";
      case "info":
        return "#2196F3";
      default:
        return colors.text;
    }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <Pressable
        style={[
          styles.notificationItem,
          { backgroundColor: notification.read ? "transparent" : colors.card },
          { borderLeftColor: getIconColor(), borderLeftWidth: 4 },
        ]}
      >
        <View style={styles.iconContainer}>
          <BlurView intensity={20} style={styles.iconBlur}>
            <Ionicons
              name={notification.icon}
              size={24}
              color={getIconColor()}
            />
          </BlurView>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {notification.title}
            </Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={[styles.message, { color: colors.text }]}>
            {notification.message}
          </Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const NotificationsScreen = () => {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.headerContent}>
          <Feather
            onPress={() => router.back()}
            name="arrow-left"
            size={24}
            color={"#fff"}
          />
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
            Notifications
          </Text>
        </View>
        <Pressable style={styles.markAllButton}>
          <Text style={[styles.markAllText, { color: colors.primary }]}>
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            index={index}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerContent: {
    padding: 16,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  iconBlur: {
    padding: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2196F3",
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
    opacity: 0.8,
  },
  time: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
});
