import DefaultLoader from '@/src/components/loader/DefaultLoader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type OnboardingContent = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

const onBoradingContent: OnboardingContent[] = [
  {
    id: 1,
    title: "Welcome to MyMoney",
    description: "Take control of your money, effortlessly track your spending and savings.",
    icon: "wallet",
  },
  {
    id: 2,
    title: "Track Your Expenses",
    description: "Automatically categorize expenses and understand your spending habits.",
    icon: "chart-line",
  },
  {
    id: 3,
    title: "Set Budgets, Save More",
    description: "Create custom budgets and stay on top of your financial goals.",
    icon: "piggy-bank",
  },
];

const OnboardingScreen = () => {
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDone = async () => {
    setLoading(true);
    await AsyncStorage.setItem('isOnboarded', 'true');
    router.replace("/(auth)/login");
    setLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < onBoradingContent.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleDone();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  if (loading) {
    return <DefaultLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {currentIndex > 0 && (
          <TouchableOpacity 
            onPress={handleBack} 
            style={styles.backButton}
          >
            <MaterialCommunityIcons 
              name="arrow-left" 
              size={24} 
              color="#BB86FC" 
            />
          </TouchableOpacity>
        )}
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={onBoradingContent[currentIndex].icon} 
            size={120} 
            color="#BB86FC" 
          />
        </View>
        <Text style={styles.title}>{onBoradingContent[currentIndex].title}</Text>
        <Text style={styles.description}>{onBoradingContent[currentIndex].description}</Text>
      </View>

      {/* Progress Indicators */}
      <View style={styles.indicatorContainer}>
        {onBoradingContent.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {currentIndex < onBoradingContent.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={handleNext} 
          style={[
            styles.nextButton,
            currentIndex === onBoradingContent.length - 1 && styles.fullWidthButton
          ]}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onBoradingContent.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(187, 134, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#B3B3B3',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333333',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#BB86FC',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  skipButton: {
    padding: 15,
  },
  skipButtonText: {
    color: '#BB86FC',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#BB86FC',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  fullWidthButton: {
    flex: 1,
    marginLeft: 0,
  },
  nextButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
