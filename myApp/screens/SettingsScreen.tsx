
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme, logout, user } = useAppContext();
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    logout();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? COLORS.bgDark : COLORS.white }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? COLORS.white : COLORS.black} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: isDarkMode ? COLORS.white : COLORS.black }]}>Cài đặt</Text>
      </View>

      {user && (
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={[styles.userName, { color: isDarkMode ? COLORS.white : COLORS.black }]}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      )}

      <View style={styles.updateSection}>
        <Text style={[styles.updateText, { color: isDarkMode ? COLORS.white : COLORS.black }]}>Đang cập nhật...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: SPACING.lg,
  },
  headerText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  updateSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textMuted,
  },
});

export default SettingsScreen;
