import {
  _entering,
  _layout,
  AnimatedPressable,
} from "@/src/constants/Animation";
import { categoryData } from "@/src/constants/Colors";
import { useAddedMoneyStore } from "@/src/store/addedMoneyStore";
import { formatCurrency } from "@/src/utils/helperFunction";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated from "react-native-reanimated";

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
  const { monthlyBalance } = useAddedMoneyStore();
  const totalBalance = month ? monthlyBalance[month] || 0 : 0;

  const isOpen = expanded[category];

  const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const percentUsed =
    totalBalance > 0 ? Math.min((categoryTotal / totalBalance) * 100, 100) : 0;

  const toggleCategory = (category: string) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const cData = categoryData.filter((c) => c.cName === category);
  const IconComponent = cData[0].iconComponent;

  return (
    <Animated.View layout={_layout} style={styles.container}>
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
          <View>
            <Text style={styles.categoryName}>
              {category}
            </Text>
            <Text style={styles.percentage}>
              {Math.round(percentUsed)}%
            </Text>
          </View>
        </View>

        <Text style={styles.total}>{formatCurrency(categoryTotal)}</Text>
      </AnimatedPressable>

      {isOpen && (
        <Animated.View
          entering={_entering}
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
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 16,
    borderRadius: 999,
  },
  categoryName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  percentage: {
    color: '#c2c2c2',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  total: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  itemsContainer: {
    paddingLeft: 24,
    marginTop: 8,
    gap: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    color: '#fff',
    textTransform: 'capitalize',
    fontWeight: '500',
    fontSize: 18,
  },
  itemPrice: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 18,
  },
});
