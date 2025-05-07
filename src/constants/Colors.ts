import Feather from '@expo/vector-icons/Feather';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#000000',
  text: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  gray: {
    100: '#F2F2F7',
    200: '#E5E5EA',
    300: '#D1D1D6',
    400: '#C7C7CC',
    500: '#AEAEB2',
    600: '#8E8E93',
    700: '#636366',
    800: '#48484A',
    900: '#3A3A3C',
  },
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const categoryColorMap: Record<string, string> = {
  food: "#4CAF50",
  travel: "#FF9800",
  shopping: "#2196F3",
  utilities: "#9C27B0",
  gift: "#E91E63",
  invest: "#00BCD4",
  emi: "#F44336",
  uncategorized: "#607D8B",
};

export const categoryData = [
  {
    cName: "food",
    color: "#4CAF50",
    iconComponent: Feather,
    iconProps: { name: "coffee", size: 24, color: "white" },
  },
  {
    cName: "travel",
    color: "#FF9800",
    iconComponent: Feather,
    iconProps: { name: "map", size: 24, color: "white" },
  },
  {
    cName: "shopping",
    color: "#2196F3",
    iconComponent: Feather,
    iconProps: { name: "shopping-bag", size: 24, color: "white" },
  },
  {
    cName: "utilities",
    color: "#9C27B0",
    iconComponent: Feather,
    iconProps: { name: "slack", size: 24, color: "white" },
  },
  {
    cName: "gift",
    color: "#E91E63",
    iconComponent: Feather,
    iconProps: { name: "gift", size: 24, color: "white" },
  },
  {
    cName: "invest",
    color: "#00BCD4",
    iconComponent: Feather,
    iconProps: { name: "activity", size: 24, color: "white" },
  },
  {
    cName: "emi",
    color: "#F44336",
    iconComponent: Feather,
    iconProps: { name: "credit-card", size: 24, color: "white" },
  },
  {
    cName: "uncategorized",
    color: "#607D8B",
    iconComponent: null,
    iconProps: {},
  },
];

export const notificationIcons = [
  {
    name: "success",
    icon: "checkmark-circle",
    color: "#4CAF50",
  },
  {
    name: "warning",
    icon: "alert-triangle",
    color: "#FF9800",
  },
  {
    name: "info",
    icon: "alert-circle",
    color: "#2196F3",
  },
];
