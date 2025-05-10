import {
  _layout,
  AnimatedPressable
} from "@/src/constants/Animation";
import { categoryData } from "@/src/constants/Colors";
import { useAddedMoneyStore } from "@/src/store/addedMoneyStore";
import { useMonthlySummaryStore } from "@/src/store/monthlySummaryStore";
import { formatCurrency } from "@/src/utils/helperFunction";
import Feather from "@expo/vector-icons/Feather";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

interface CategoryItemsProps {
  month: string;
  category: string;
  items: {
    item_name: string;
    price: number;
    created_at: string;
  }[];
}

const CategoryItems = ({ category, items, month }: CategoryItemsProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { getTotalAdded, getTotalSpent } = useMonthlySummaryStore();

  const isOpen = expanded[category];

  const totalAdded = getTotalAdded(month);
  const totalSpent = getTotalSpent(month);
  const totalBalance = totalAdded - totalSpent;

  const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const percentUsed = totalBalance > 0 ? Math.min((categoryTotal / totalBalance) * 100, 100) : 0;

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const cData = categoryData.filter((c) => c.cName === category);
  const IconComponent = cData[0].iconComponent;

  return (
    <Animated.View 
      layout={_layout} 
      style={[
        styles.container,
        { borderLeftColor: cData[0].color }
      ]}
    >
      <AnimatedPressable
        layout={_layout}
        style={styles.header}
        onPress={() => toggleCategory(category)}
      >
        <View style={styles.categoryInfo}>
          <View
            style={[styles.iconContainer, { backgroundColor: cData[0].color }]}
          >
            {IconComponent && (
              <IconComponent
                {...cData[0].iconProps}
                name={cData[0].iconProps?.name as any}
                color={"#fff"}
              />
            )}
          </View>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>
              {category}
            </Text>
            <View style={styles.percentageContainer}>
              <View style={[styles.percentageBar, { width: `${percentUsed}%` }]} />
              <Text style={styles.percentage}>
                {Math.round(percentUsed)}%
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.total}>{formatCurrency(categoryTotal)}</Text>
          <Feather 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#A0A0A0" 
          />
        </View>
      </AnimatedPressable>

      {isOpen && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          layout={_layout}
          style={styles.itemsContainer}
        >
          {items.map((item, idx) => (
            <View
              key={`${item.item_name}-${idx}`}
              style={styles.item}
            >
              <Text style={styles.itemName}>
                {item.item_name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price)}
              </Text>
            </View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default CategoryItems;

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    overflow: "hidden",
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    flex: 1,
  },
  categoryDetails: {
    flex: 1,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  categoryName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  percentageContainer: {
    height: 4,
    backgroundColor: "#2A2A2A",
    borderRadius: 2,
    overflow: "hidden",
    position: "relative",
  },
  percentageBar: {
    position: "absolute",
    height: "100%",
    backgroundColor: "#A0A0A0",
    borderRadius: 2,
  },
  percentage: {
    position: "absolute",
    right: 0,
    top: -20,
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  total: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  itemsContainer: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  itemName: {
    color: "#fff",
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 16,
  },
  itemPrice: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
});
