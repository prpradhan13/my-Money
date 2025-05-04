import { AnimatedCircle } from "@/src/constants/Animation";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import AddMoneyModal from "@/src/components/modal/AddMoneyModal";

export const DonutChart = ({
  radius = 60,
  strokeWidth = 10,
  spent,
  total,
}: {
  radius?: number;
  strokeWidth?: number;
  spent: number;
  total: number;
}) => {
  const [addMoneyModalVisible, setAddMoneyModalVisible] = useState(false);
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const percent = (spent / total) * 100;
  const strokeDashoffset =
    circumference - (circumference * Math.min(percent, 100)) / 100;

  return (
    <>
      <Pressable onPress={() => setAddMoneyModalVisible(true)}>
        <Svg height={radius * 2} width={radius * 2}>
          <G rotation="-90" origin={`${radius}, ${radius}`}>
            {/* Background circle */}
            <Circle
              stroke="#3f3f46"
              fill="transparent"
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              strokeWidth={strokeWidth}
            />

            {/* Spent arc */}
            <AnimatedCircle
              stroke="#ef4444"
              fill="transparent"
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
      </Pressable>

      {addMoneyModalVisible && (
        <View className="absolute top-0 left-0 right-0">
          <AddMoneyModal
            modalVisible={addMoneyModalVisible}
            setModalVisible={setAddMoneyModalVisible}
          />
        </View>
      )}
    </>
  );
};
