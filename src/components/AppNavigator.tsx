// navigation/AppNavigator.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import icon

// Import các màn hình
import HomeScreen from '../screens/HomeScreen';
import SurveyScreen from '../screens/SurveyScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Ẩn header mặc định
        tabBarActiveTintColor: '#007AFF', // Màu cho tab đang active
        tabBarInactiveTintColor: '#8e8e93', // Màu cho tab không active
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: 90,
          borderTopWidth: 0,
          elevation: 5,
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 10,
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {

          let iconPath;
          const iconStyle = { width: size, height: size, tintColor: color };

          if (route.name === 'Home') {
            iconPath = require('../../assets/images/home.png');
          } else if (route.name === 'Survey') {
            iconPath = require('../../assets/images/survey.png');
          } else if (route.name === 'Setting') {
            iconPath = require('../../assets/images/setting.png');
          }
          return <Image source={iconPath} style={iconStyle} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Survey" component={SurveyScreen} />
      <Tab.Screen name="Setting" component={SettingsScreen} />
    </Tab.Navigator>
  );
}