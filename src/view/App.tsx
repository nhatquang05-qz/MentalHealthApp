import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../components/AppNavigator';
import { StatusBar } from 'react-native'; // TỪ react-native

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
    </NavigationContainer>
  );
}