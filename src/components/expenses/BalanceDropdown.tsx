import { _entering } from "@/src/constants/Animation";
import React from "react";
import { Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";

type BalanceDropdownProps = {
  monthlyBalance: number;
  remainingBalance: number;
  setShowBalance: (value: number) => void;
  closeDropdown: () => void;
};

const BalanceDropdown = ({
  monthlyBalance,
  remainingBalance,
  setShowBalance,
  closeDropdown,
}: BalanceDropdownProps) => {
  const options = [
    { label: "Monthly Balance", value: monthlyBalance },
    { label: "Remaining", value: remainingBalance },
  ];

  return (
    <Animated.View entering={_entering} className="min-w-[160px] bg-white absolute top-full left-1/2 -translate-x-1/2 p-2 z-20 rounded-lg items-center">
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPress={() => {
            setShowBalance(option.value);
            closeDropdown();
          }}
          className="py-1"
        >
          <Text className="text-black font-medium">
            {option.label}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
};

export default BalanceDropdown;
