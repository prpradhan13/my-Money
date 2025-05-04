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

  return (
    <Animated.View entering={_entering} style={styles.container}>
      {options.map((option, index) => (
        <Pressable
          key={index}
          onPress={() => {
            setShowBalance(option.value);
            closeDropdown();
          }}
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
    backgroundColor: '#fff',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: [{ translateX: -80 }],
    padding: 8,
    zIndex: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  option: {
    paddingVertical: 4,
  },
  optionText: {
    color: '#000',
    fontWeight: '500',
  },
});
