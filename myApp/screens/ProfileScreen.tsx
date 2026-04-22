import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_SECTIONS = [
  {
    title: 'Đơn Hàng',
    items: [
      { id: '1', icon: 'receipt-outline' as const, label: 'Đơn hàng của tôi', badge: null, route: '/orders' },
      { id: '2', icon: 'time-outline' as const, label: 'Lịch sử mua hàng', badge: null, route: '/orders' },
      { id: '3', icon: 'refresh-outline' as const, label: 'Đổi trả & Hoàn tiền', badge: null, route: '/returns' },
    ],
  },
  {
    title: 'Tài Khoản',
    items: [
      { id: '4', icon: 'location-outline' as const, label: 'Địa chỉ giao hàng', badge: null, route: '/addresses' },
      { id: '6', icon: 'gift-outline' as const, label: 'Ưu đãi & Voucher', badge: null, route: '/vouchers' },
      { id: '7', icon: 'star-outline' as const, label: 'Hạng thành viên', badge: 'VIP', route: '/membership' },
    ],
  },
  {
    title: 'Hỗ Trợ',
    items: [
      { id: '8', icon: 'chatbubble-outline' as const, label: 'Liên hệ tư vấn', badge: null, route: '/contact' },
      { id: '9', icon: 'help-circle-outline' as const, label: 'Câu hỏi thường gặp', badge: null, route: '/faq' },
      { id: '10', icon: 'settings-outline' as const, label: 'Cài đặt', badge: null, route: '/settings' },
      { id: '11', icon: 'information-circle-outline' as const, label: 'Giới thiệu', badge: null, route: '/about' },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { isAuthenticated, user, logout, wishlist, cart, orderCount, voucherCount } = useAppContext();

  const handleLogout = () => {
    logout();
    // Optionally, show a toast or confirmation message
  };

  const handleMenuItemPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
    // Handle other cases if needed, e.g., open a modal
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="Tài Khoản" showBack={true} />
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => !isAuthenticated && router.push('/login' as any)}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={COLORS.gold} />
            </View>
            {isAuthenticated && (
              <View style={styles.vipBadge}>
                <Ionicons name="diamond" size={10} color={COLORS.black} />
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{isAuthenticated ? user?.name : 'Khách hàng'}</Text>
            <Text style={styles.profileEmail}>
              {isAuthenticated ? user?.email : 'Đăng nhập để trải nghiệm tốt hơn'}
            </Text>
          </View>
          {!isAuthenticated && (
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={COLORS.gold} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Auth buttons */}
        {!isAuthenticated && (
          <View style={styles.authSection}>
            <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginBtnText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerBtn} onPress={() => router.push('/register' as any)}>
              <Text style={styles.registerBtnText}>ĐĂNG KÝ</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{isAuthenticated ? orderCount : '0'}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{wishlist.length}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{isAuthenticated ? voucherCount : '0'}</Text>
            <Text style={styles.statLabel}>Voucher</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={18} color={COLORS.gold} />
            <Text style={styles.statLabel}>{isAuthenticated ? 'VIP' : '---'}</Text>
          </View>
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuItemPress(item.route)}>
                <View style={styles.menuItemLeft}>
                  <Ionicons name={item.icon} size={22} color={COLORS.textMuted} />
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <View
                      style={[
                        styles.menuBadge,
                        item.badge === 'VIP' ? styles.menuBadgeVip : {},
                      ]}>
                      <Text
                        style={[
                          styles.menuBadgeText,
                          item.badge === 'VIP' ? styles.menuBadgeTextVip : {},
                        ]}>
                        {item.badge}
                      </Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Logout Button */}
        {isAuthenticated && (
          <View style={styles.logoutSection}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>ĐĂNG XUẤT</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },

  // Profile
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.md,
    padding: SPACING.xl, backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5,
    borderColor: COLORS.border, gap: SPACING.lg,
  },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.gold,
  },
  vipBadge: {
    position: 'absolute', bottom: -2, right: -2,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.bgCard,
  },
  profileInfo: { flex: 1 },
  profileName: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: '600', marginBottom: 2 },
  profileEmail: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },

  // Auth
  authSection: { flexDirection: 'row', marginHorizontal: SPACING.lg, marginTop: SPACING.lg, gap: SPACING.md },
  loginBtn: { flex: 1, backgroundColor: COLORS.gold, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  loginBtnText: { color: COLORS.black, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },
  registerBtn: { flex: 1, borderWidth: 1, borderColor: COLORS.gold, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  registerBtnText: { color: COLORS.gold, fontSize: FONT_SIZES.sm, fontWeight: '700', letterSpacing: 1 },

  // Stats
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.lg, marginTop: SPACING.xl,
    padding: SPACING.xl, backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg, borderWidth: 0.5, borderColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center', gap: SPACING.xs },
  statNumber: { color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: '700' },
  statLabel: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs },
  statDivider: { width: 0.5, height: 30, backgroundColor: COLORS.border },

  // Menu
  section: { marginHorizontal: SPACING.lg, marginTop: SPACING.xl },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201, 169, 110, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  menuBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  menuBadgeVip: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  menuBadgeText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  menuBadgeTextVip: {
    color: COLORS.gold,
  },

  // Logout
  logoutSection: {
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  logoutBtn: {
    backgroundColor: COLORS.bgCard,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: COLORS.red,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});
