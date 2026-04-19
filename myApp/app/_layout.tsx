import React, { useState } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { COLORS } from '@/constants/theme';
import { AppProvider } from '@/context/AppContext';
import SplashScreen from '@/screens/SplashScreen';

// Custom dark theme for VELMORA
const VelmoraTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.gold,
    background: COLORS.bgDark,
    card: COLORS.bgCard,
    text: COLORS.white,
    border: COLORS.border,
    notification: COLORS.sale,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <ThemeProvider value={VelmoraTheme}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.bgDark },
            headerTintColor: COLORS.white,
            headerTitleStyle: { fontWeight: '500' },
            contentStyle: { backgroundColor: COLORS.bgDark },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="product/[id]"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="login"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="search"
            options={{ headerShown: false, animation: 'fade' }}
          />
          <Stack.Screen
            name="about"
            options={{ headerShown: false, animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Chi Tiết' }}
          />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AppProvider>
  );
}
