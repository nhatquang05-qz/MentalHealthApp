import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import SurveyScreen from '../screens/SurveyScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MusicScreen from '../screens/MusicScreen';
import QuoteScreen from '../screens/QuoteScreen';
import DailyCheckInScreen from '../screens/DailyCheckInScreen';
import DailyResultScreen from '../screens/DailyResultScreen';
import SpecificTestScreen from '../screens/SpecificTestScreen';
import SpecificResultScreen from '../screens/SpecificResultScreen';
import BurnWorriesScreen from '../screens/BurnWorriesScreen';
import SOSScreen from '../screens/SOSScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import GratitudeScreen from '../screens/GratitudeScreen';
import MapScreen from '../screens/MapScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarStyle: {
          backgroundColor: colors.card,
          height: Platform.OS === 'ios' ? 95 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: isDark ? '#000' : '#ccc',
          shadowOpacity: 0.1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Survey') {
            iconName = focused ? 'happy' : 'happy-outline';
          } else if (route.name === 'Music') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang Chủ' }} />
      <Tab.Screen name="Survey" component={SurveyScreen} options={{ title: 'Khảo Sát' }} />
      <Tab.Screen name="Music" component={MusicScreen} options={{ title: 'Thư Giãn' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài Đặt' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
      <Stack.Screen name="DailyResult" component={DailyResultScreen} />
      <Stack.Screen name="SpecificTest" component={SpecificTestScreen} />
      <Stack.Screen name="SpecificResult" component={SpecificResultScreen} />
      <Stack.Screen name="BurnWorries" component={BurnWorriesScreen} />
      <Stack.Screen name="SOS" component={SOSScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} />
      <Stack.Screen name="Gratitude" component={GratitudeScreen} />
      <Stack.Screen name="Quote" component={QuoteScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
    </Stack.Navigator>
  );
}
