import { _entering } from "@/src/constants/Animation";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
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

  const handleOptionPress = (value: number) => {
    setShowBalance(value);
    // Add a small delay before closing the dropdown
    setTimeout(() => {
      closeDropdown();
    }, 200);
  };

  return (
    <Animated.View entering={_entering} style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPress={() => handleOptionPress(option.value)}
          style={styles.option}
        >
          <Text style={styles.optionText}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
};

export default BalanceDropdown;

const styles = StyleSheet.create({
  container: {
    minWidth: 160,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -80 }],
    padding: 8,
    zIndex: 50,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontWeight: '500',
  },
});
