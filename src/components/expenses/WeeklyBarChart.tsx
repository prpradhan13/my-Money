import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

interface WeeklyBarChartProps {
  data: {
    price: number;
    created_at: string;
  }[];
}

const WeeklyBarChart = ({ data }: WeeklyBarChartProps) => {
  const [monthIndex, setMonthIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [weekOffset, setWeekOffset] = useState(0);

  const monthsWithData = useMemo(() => {
    const map = new Map<string, typeof data>();

    data.forEach((item) => {
      const monthStart = dayjs(item.created_at).startOf("month").toISOString();
      if (!map.has(monthStart)) {
        map.set(monthStart, []);
      }
      map.get(monthStart)?.push(item);
    });

    return Array.from(map.entries()).sort(
      ([a], [b]) => dayjs(a).valueOf() - dayjs(b).valueOf()
    );
  }, [data]);

  const currentMonthStart = useMemo(() => {
    if (!monthsWithData.length) return dayjs().startOf("month");
    return dayjs(monthsWithData[monthIndex][0]);
  }, [monthIndex, monthsWithData]);

  const currentMonthData = useMemo(() => {
    return monthsWithData[monthIndex]?.[1] ?? [];
  }, [monthIndex, monthsWithData]);

  const rangeStart = currentMonthStart;
  const rangeEnd = currentMonthStart.endOf("month");

  const currentWeekStart = useMemo(() => {
    return dayjs().startOf("week").add(weekOffset, "week");
  }, [weekOffset]);

  const currentWeekEnd = useMemo(() => {
    return currentWeekStart.endOf("week");
  }, [currentWeekStart]);

  const handlePrev = () => {
    if (viewMode === "week") {
      setWeekOffset((i) => i - 1);
    } else if (viewMode === "month") {
      setMonthIndex((i) => Math.max(i - 1, 0));
    }
  };

  const handleNext = () => {
    if (viewMode === "week") {
      setWeekOffset((i) => i + 1);
    } else if (viewMode === "month") {
      setMonthIndex((i) => Math.min(i + 1, monthsWithData.length - 1));
    }
  };

  const barData = useMemo(() => {
    if (viewMode === "week") {
      const dayTotals = Array(7).fill(0);

      currentMonthData.forEach((item) => {
        const date = dayjs(item.created_at);
        if (date.isBetween(currentWeekStart, currentWeekEnd, null, "[]")) {
          const dayOfWeek = date.day(); // 0 = Sunday
          dayTotals[dayOfWeek] += item.price;
        }
      });

      return dayTotals.map((value, i) => ({
        label: dayjs().day(i).format("dd"), // 'Su', 'Mo', etc.
        value,
        frontColor: "#22d3ee",
      }));
    } else {
      const dayTotals = Array(rangeEnd.date()).fill(0);
      currentMonthData.forEach((item) => {
        const dayOfMonth = dayjs(item.created_at).date() - 1;
        dayTotals[dayOfMonth] += item.price;
      });

      return dayTotals.map((value, i) => ({
        label: `${i + 1}`,
        value,
        frontColor: "#177AD5",
      }));
    }
  }, [viewMode, currentMonthData, currentWeekStart, currentWeekEnd, rangeEnd]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {rangeStart.format("MMM D")} - {rangeEnd.format("D")}
      </Text>

      <BarChart
        barWidth={22}
        noOfSections={4}
        barBorderRadius={4}
        frontColor="lightgray"
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={{ color: "#fff" }}
        yAxisTextStyle={{ color: "#fff" }}
        showFractionalValues
      />
      
      <Pressable
        onPress={() => {
          setViewMode((prev) => (prev === "month" ? "week" : "month"));
          setWeekOffset(0);
        }}
        style={styles.viewModeButton}
      >
        <Text style={styles.viewModeText}>
          {viewMode === "month" ? "View Week" : "View Month"}
        </Text>
      </Pressable>
      
      {viewMode === "week" && (
        <View style={styles.weekControls}>
          <Pressable
            onPress={handlePrev}
            style={styles.controlButton}
          >
            <Feather name="chevron-left" size={24} />
          </Pressable>

          <Text style={styles.weekRange}>
            {currentWeekStart.format("MMM D")} -{" "}
            {currentWeekEnd.format("MMM D")}
          </Text>

          <Pressable
            onPress={handleNext}
            style={styles.controlButton}
          >
            <Feather name="chevron-right" size={24} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default WeeklyBarChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    padding: 8,
    borderRadius: 12,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#fff',
  },
  viewModeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  viewModeText: {
    color: '#000',
    fontWeight: '600',
  },
  weekControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  controlButton: {
    backgroundColor: '#c2c2c2',
    padding: 4,
    borderRadius: 999,
  },
  weekRange: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
