import { COLORS } from '@/constants/theme';
import { AppProvider, useAppContext } from '@/context/AppContext';
import SplashScreen from '@/screens/SplashScreen';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import 'react-native-reanimated';
import { useFonts, PlayfairDisplay_700Bold_Italic } from '@expo-google-fonts/playfair-display';
import { Allura_400Regular } from '@expo-google-fonts/allura';

// Custom light theme
const VelmoraLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.white,
    card: '#F5F5F5',
    text: COLORS.black,
    border: '#E5E5E5',
    notification: COLORS.sale,
  },
};

// Custom dark theme
const VelmoraDarkTheme = {
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

function AppContent() {
  const { theme } = useAppContext();
  const isDarkMode = theme === 'dark';

  return (
    <ThemeProvider value={isDarkMode ? VelmoraDarkTheme : VelmoraLightTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: isDarkMode ? COLORS.bgDark : COLORS.white },
          headerTintColor: isDarkMode ? COLORS.white : COLORS.black,
          headerTitleStyle: { fontWeight: '500' },
          contentStyle: { backgroundColor: isDarkMode ? COLORS.bgDark : COLORS.white },
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
          name="settings"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="faq"
          options={{ title: '', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="contact"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Chi Tiết' }}
        />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="orders" options={{ headerShown: false }} />
        <Stack.Screen name="returns" options={{ headerShown: false }} />
        <Stack.Screen name="vouchers" options={{ headerShown: false }} />
        <Stack.Screen name="membership" options={{ headerShown: false }} />
        <Stack.Screen name="addresses" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold_Italic,
    Allura_400Regular,
  });

  if (showSplash || !fontsLoaded) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
