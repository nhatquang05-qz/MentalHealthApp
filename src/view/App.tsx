import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from '../components/AppNavigator';
import { StatusBar } from 'react-native';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { MusicProvider } from '../context/MusicContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar barStyle="default" backgroundColor="transparent" translucent={true} />
          </NavigationContainer>
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
