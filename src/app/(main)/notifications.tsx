import DefaultLoader from "@/src/components/loader/DefaultLoader";
import { notificationIcons } from "@/src/constants/Colors";
import { NotificationsType } from "@/src/types/notification.type";
import { useGetAllNotifications, useGetAllUnreadNotifications, useMarkAllNotificationsAsRead, useMarkNotificationAsRead } from "@/src/utils/query/notificationQuery";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
  notification: NotificationsType;
  index: number;
}) => {
  const { colors } = useTheme();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const icon = notificationIcons.find(
    (icon) => icon.name === notification.type
  );

  if (!icon) return null;

  return (
    <View style={{ flex: 1, paddingHorizontal: 16 }}>
      <Pressable
        onPress={() => {
          if (!notification.read) {
            markAsRead(notification.id);
          }
        }}
        style={[
          styles.notificationItem,
          { backgroundColor: notification.read ? "transparent" : colors.card },
          { borderLeftColor: icon.color ?? "yellow", borderLeftWidth: 4 },
        ]}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconBlur}>
            <Feather
              name={"alert-triangle"}
              size={24}
              color={icon.color || "yellow"}
            />
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {notification.title}
            </Text>
            {!notification.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={[styles.message, { color: colors.text }]}>
            {notification.description}
          </Text>
          <Text style={styles.time}>
            {dayjs(notification.created_at).format("DD MMM YYYY")}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const NotificationsScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { colors } = useTheme();

  const { data: notifications, isLoading, refetch } = useGetAllUnreadNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAllAsRead } = useMarkAllNotificationsAsRead();


  if (isLoading) return <DefaultLoader />;
  if (isLoading) return <DefaultLoader />;

  if (!notifications || notifications.length === 0) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>No notifications</Text>
    </View>
  );

  const groupedSections = notifications.reduce((acc, item) => {
    const date = dayjs(item.created_at).format("DD MMM YYYY");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, NotificationsType[]>);

  const sections = Object.entries(groupedSections).map(
    ([date, notifications]) => ({
      title: date,
      data: notifications,
    })
  );

  const handleRefresh = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

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
          paddingHorizontal: 16,
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
        <Pressable onPress={() => markAllAsRead()} disabled={isMarkingAllAsRead} style={styles.markAllButton}>
          <Text style={[styles.markAllText, { color: colors.primary }]}>
            Mark all as read
          </Text>
        </Pressable>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <NotificationItem notification={item} index={index} />
        )}
        renderSectionHeader={({ section }) => (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>
              {section.title}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>No notifications</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
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
    backgroundColor: "#2a2a2a",
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
