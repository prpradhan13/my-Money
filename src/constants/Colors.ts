import Feather from '@expo/vector-icons/Feather';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
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
