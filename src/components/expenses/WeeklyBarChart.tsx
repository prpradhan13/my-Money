import { View, Text, Pressable } from "react-native";
import React, { useMemo, useState } from "react";
import { BarChart } from "react-native-gifted-charts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import Feather from "@expo/vector-icons/Feather";
import isBetween from "dayjs/plugin/isBetween";

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
    <View className="bg-[#2a2a2a] p-2 rounded-xl py-4">
      <Text className="text-2xl font-bold mb-4 text-white">
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
        className="absolute right-4 top-4 bg-white px-3 py-1 rounded-full"
      >
        <Text className="text-black font-semibold">
          {viewMode === "month" ? "View Week" : "View Month"}
        </Text>
      </Pressable>
      
      {viewMode === "week" && (
        <View className="flex-row justify-between mt-4">
          <Pressable
            onPress={handlePrev}
            className="bg-[#c2c2c2] p-1 rounded-full"
          >
            <Feather name="chevron-left" size={24} />
          </Pressable>

          <Text className="text-white text-lg font-semibold">
            {currentWeekStart.format("MMM D")} -{" "}
            {currentWeekEnd.format("MMM D")}
          </Text>

          <Pressable
            onPress={handleNext}
            className="bg-[#c2c2c2] p-1 rounded-full"
          >
            <Feather name="chevron-right" size={24} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default WeeklyBarChart;
