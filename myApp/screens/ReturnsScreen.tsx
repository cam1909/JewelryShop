import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/context/AppContext';

export default function ReturnsScreen() {
  const { theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Chính Sách Đổi Trả" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconWrap}>
          <Ionicons name="refresh-circle-outline" size={80} color={currentTheme.accent} />
          <Text style={[styles.title, { color: currentTheme.text }]}>Chính Sách Đổi Trả Dễ Dàng</Text>
          <Text style={[styles.subtitle, { color: currentTheme.textMuted }]}>
            Chúng tôi luôn đặt sự hài lòng của bạn lên hàng đầu. Đổi trả an tâm với đặc quyền từ VELMORA.
          </Text>
        </View>

        <View style={[styles.policyCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={24} color={currentTheme.accent} />
            <View style={styles.policyTextWrap}>
              <Text style={[styles.policyTitle, { color: currentTheme.text }]}>Đổi trả trong 30 ngày</Text>
              <Text style={[styles.policyDesc, { color: currentTheme.textMuted }]}>Kể từ ngày nhận hàng với bất kỳ lý do gì</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: currentTheme.border }]} />
          <View style={styles.policyItem}>
            <Ionicons name="star" size={24} color={currentTheme.accent} />
            <View style={styles.policyTextWrap}>
              <Text style={[styles.policyTitle, { color: currentTheme.text }]}>Bảo hành trọn đời</Text>
              <Text style={[styles.policyDesc, { color: currentTheme.textMuted }]}>Đánh bóng, làm mới và kiểm tra chấu đá miễn phí</Text>
            </View>
          </View>
          <View style={[styles.divider, { backgroundColor: currentTheme.border }]} />
          <View style={styles.policyItem}>
            <Ionicons name="wallet-outline" size={24} color={currentTheme.accent} />
            <View style={styles.policyTextWrap}>
              <Text style={[styles.policyTitle, { color: currentTheme.text }]}>Hoàn tiền nhanh chóng</Text>
              <Text style={[styles.policyDesc, { color: currentTheme.textMuted }]}>Tiền sẽ được hoàn về tài khoản của bạn trong 2-3 ngày làm việc</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: currentTheme.accent }]} onPress={() => alert('Đã gửi yêu cầu đổi trả!')}>
          <Text style={[styles.btnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>YÊU CẦU ĐỔI TRẢ NGAY</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  scrollContent: { padding: SPACING.xl },
  
  iconWrap: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    marginTop: SPACING.xl,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  policyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xxl,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  policyTextWrap: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  policyTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  policyDesc: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  
  primaryBtn: {
    backgroundColor: COLORS.gold,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  btnText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
