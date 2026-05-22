import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View, Switch, ScrollView } from 'react-native';

import { COLORS, FONT_SIZES, SPACING, Theme, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme, logout, user } = useAppContext();
  const isDarkMode = theme === 'dark';
  const currentTheme = Theme[theme];

  const handleLogout = () => {
    logout();
    router.replace('/(tabs)');
  };

  const handleAction = (action: () => void) => {
    if (!user) {
      router.push('/login');
    } else {
      action();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: currentTheme.text }]}>Cài đặt</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        {user ? (
          <View style={[styles.profileSection, { borderBottomColor: currentTheme.border }]}>
            <View style={[styles.avatar, { backgroundColor: currentTheme.accent }]}>
              <Text style={[styles.avatarText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={[styles.userName, { color: currentTheme.text }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: currentTheme.textMuted }]}>{user.email}</Text>
          </View>
        ) : (
          <View style={[styles.profileSection, { borderBottomColor: currentTheme.border }]}>
            <TouchableOpacity 
              style={[styles.loginBtn, { backgroundColor: currentTheme.accent }]}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.loginBtnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Đăng nhập / Đăng ký</Text>
            </TouchableOpacity>
            <Text style={[styles.loginHint, { color: currentTheme.textMuted }]}>Đăng nhập để đồng bộ giỏ hàng và xem lịch sử đơn hàng của bạn</Text>
          </View>
        )}

        {/* Cài đặt Hệ thống */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textMuted }]}>CÀI ĐẶT HỆ THỐNG</Text>
          
          {/* Toggle Theme Row */}
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: currentTheme.card }]}
            onPress={() => handleAction(toggleTheme)}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color={currentTheme.accent} />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: currentTheme.text }]}>Chế độ tối (Dark Mode)</Text>
                <Text style={[styles.rowSubLabel, { color: currentTheme.textMuted }]}>
                  {isDarkMode ? "Đang bật chế độ ban đêm" : "Đang bật chế độ ban ngày"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={() => handleAction(toggleTheme)}
              trackColor={{ false: '#767577', true: currentTheme.accent }}
              thumbColor={isDarkMode ? currentTheme.accent : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              disabled={!user} // Disable switch state control, trigger redirect via row click
            />
          </TouchableOpacity>

          {/* Ngôn ngữ */}
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: currentTheme.card }]}
            onPress={() => handleAction(() => {})}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name="globe-outline" size={20} color={currentTheme.accent} />
              </View>
              <View>
                <Text style={[styles.rowLabel, { color: currentTheme.text }]}>Ngôn ngữ</Text>
                <Text style={[styles.rowSubLabel, { color: currentTheme.textMuted }]}>Tiếng Việt (Mặc định)</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Hỗ trợ & Thông tin */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.textMuted }]}>HỖ TRỢ & THÔNG TIN</Text>

          {/* Trung tâm trợ giúp */}
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: currentTheme.card }]}
            onPress={() => handleAction(() => router.push('/faq'))}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name="help-circle-outline" size={20} color={currentTheme.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: currentTheme.text }]}>Trung tâm trợ giúp (FAQ)</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
          </TouchableOpacity>

          {/* Liên hệ */}
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: currentTheme.card }]}
            onPress={() => handleAction(() => router.push('/contact'))}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name="mail-outline" size={20} color={currentTheme.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: currentTheme.text }]}>Liên hệ với Velmora</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
          </TouchableOpacity>

          {/* Về chúng tôi */}
          <TouchableOpacity 
            style={[styles.row, { backgroundColor: currentTheme.card }]}
            onPress={() => handleAction(() => router.push('/about'))}
          >
            <View style={styles.rowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name="information-circle-outline" size={20} color={currentTheme.accent} />
              </View>
              <Text style={[styles.rowLabel, { color: currentTheme.text }]}>Về chúng tôi</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={currentTheme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Đăng xuất */}
        {user && (
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5', borderColor: currentTheme.border, borderWidth: 1 }]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
            <Text style={styles.logoutButtonText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        )}

        <Text style={[styles.versionText, { color: currentTheme.textMuted }]}>Phiên bản 1.0.0 • VELMORA Jewelry</Text>
      </ScrollView>
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
  scrollContent: {
    paddingVertical: SPACING.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.gold,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
  loginBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.gold,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
  loginHint: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  rowLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
  },
  rowSubLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  logoutButtonText: {
    color: COLORS.red,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
  },
  versionText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
});

export default SettingsScreen;
