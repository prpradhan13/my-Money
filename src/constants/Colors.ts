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
  food: "#38b000",
  travel: "#ff6700",
  shopping: "#00509d",
  utilities: "#7b2cbf",
  gift: "#9d4edd",
  invest: "#006400",
  emi: "#9a031e",
  uncategorized: "#9ca3af",
};

export const categoryData = [
  {
    cName: "food",
    color: "#38b000",
    iconComponent: Feather,
    iconProps: { name: "coffee", size: 24, color: "black" },
  },
  {
    cName: "travel",
    color: "#ff6700",
    iconComponent: Feather,
    iconProps: { name: "map", size: 24, color: "black" },
  },
  {
    cName: "shopping",
    color: "#00509d",
    iconComponent: Feather,
    iconProps: { name: "shopping-bag", size: 24, color: "black" },
  },
  {
    cName: "utilities",
    color: "#7b2cbf",
    iconComponent: Feather,
    iconProps: { name: "slack", size: 24, color: "black" },
  },
  {
    cName: "gift",
    color: "#9d4edd",
    iconComponent: Feather,
    iconProps: { name: "gift", size: 24, color: "black" },
  },
  {
    cName: "invest",
    color: "#006400",
    iconComponent: Feather,
    iconProps: { name: "activity", size: 24, color: "black" },
  },
  {
    cName: "emi",
    color: "#9a031e",
    iconComponent: Feather,
    iconProps: { name: "credit-card", size: 24, color: "black" },
  },
  {
    cName: "uncategorized",
    color: "#9ca3af",
    iconComponent: null,
    iconProps: {},
  },
];
