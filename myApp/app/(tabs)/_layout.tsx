import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: false, // Mình tự có custom Header rồi nên tắt header mặc định của Drawer
          drawerStyle: styles.drawer,
          drawerActiveTintColor: COLORS.gold,
          drawerActiveBackgroundColor: 'rgba(201, 169, 110, 0.1)',
          drawerInactiveTintColor: COLORS.textMuted,
          drawerLabelStyle: styles.drawerLabel,
          sceneStyle: { backgroundColor: COLORS.bgDark },
        }}>
        <Drawer.Screen
          name="index"
          options={{
            title: 'Trang Chủ',
            drawerIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="collections"
          options={{
            title: 'Bộ Sưu Tập',
            drawerIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="wishlist"
          options={{
            title: 'Yêu Thích',
            drawerIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart' : 'heart-outline'} size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="cart"
          options={{
            title: 'Giỏ Hàng',
            drawerIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'bag' : 'bag-outline'} size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: 'Tài Khoản',
            drawerIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawer: {
    backgroundColor: COLORS.bgDark,
    width: 280,
    borderRightColor: COLORS.border,
    borderRightWidth: 1,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginLeft: -10,
  },
});
