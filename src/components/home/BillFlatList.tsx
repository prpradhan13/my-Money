import { AnimatedPressable } from "@/src/constants/Animation";
import { categoryData } from "@/src/constants/Colors";
import { UpcomingBillType } from "@/src/types/upcomingBill.type";
import { formatCurrency } from "@/src/utils/helperFunction";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";

const BillFlatList = ({ bills }: { bills: UpcomingBillType[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Bills</Text>
        <Link href={"/bills"} asChild>
          <Pressable style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Feather name="chevron-right" size={16} color="#A0A0A0" />
          </Pressable>
        </Link>
      </View>

      <FlatList
        data={bills}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => <BillCard item={item} index={index} />}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

export default BillFlatList;

const BillCard = ({ item, index }: { item: UpcomingBillType; index: number }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const cData = categoryData.find(
    (c) => c.cName === item.bill_templates?.category
  ) || {
    color: "#607D8B",
    iconComponent: null,
    iconProps: {},
  };

  const IconComponent = cData.iconComponent;
  const due_date = dayjs(item.due_date).format("DD MMM YYYY");
  const daysUntilDue = dayjs(item.due_date).diff(dayjs(), 'day');

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10, stiffness: 400 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
    opacity.value = withTiming(1, { duration: 100 });
  };

  return (
    <AnimatedPressable
      entering={FadeInRight.delay(index * 100)}
      style={[
        styles.billContainer,
        { borderLeftColor: cData.color },
        animatedStyle
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.billInfoContainer}>
        <View style={[styles.iconContainer, { backgroundColor: cData.color }]}>
          {IconComponent && (
            <IconComponent
              {...cData.iconProps}
              name={cData.iconProps?.name as any}
              color="#fff"
              size={20}
            />
          )}
        </View>

        <View style={styles.billDetails}>
          <Text style={styles.billTitle}>{item.title}</Text>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={12} color="#A0A0A0" />
            <Text style={styles.billDueDate}>{due_date}</Text>
            <View style={[
              styles.daysBadge,
              daysUntilDue <= 3 && styles.daysBadgeWarning
            ]}>
              <Text style={styles.daysText}>
                {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'} left
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.billAmount}>
          {formatCurrency(item.amount)}
        </Text>
        <Text style={styles.periodText}>/month</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
  },
  flatListContainer: {
    gap: 12,
    paddingHorizontal: 4,
  },
  billContainer: {
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  billInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    borderRadius: 10,
    padding: 10,
  },
  billDetails: {
    flex: 1,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  billDueDate: {
    fontSize: 12,
    color: "#A0A0A0",
  },
  daysBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  daysBadgeWarning: {
    backgroundColor: "#F44336",
  },
  daysText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#fff",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  periodText: {
    fontSize: 12,
    color: "#A0A0A0",
  },
});
