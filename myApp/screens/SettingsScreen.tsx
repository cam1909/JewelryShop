
import { Ionicons } from '@expo/vector-icons';
import { useRouter }s from 'expo-router';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';

import { AppContext } from '../context/AppContext';
import { Colors, Theme } from '../constants/theme';

const SettingsScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(AppContext);
  const isDarkMode = theme === 'dark';

  const styles = getStyles(isDarkMode ? Theme.dark : Theme.light);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={styles.headerText.color} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cài đặt</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao diện</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Chế độ tối</Text>
          <Switch
            trackColor={{ false: '#767577', true: Colors.primary }}
            thumbColor={isDarkMode ? Colors.secondary : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={isDarkMode}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (theme: typeof Theme.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  itemText: {
    fontSize: 18,
    color: theme.text,
  },
});

export default SettingsScreen;
