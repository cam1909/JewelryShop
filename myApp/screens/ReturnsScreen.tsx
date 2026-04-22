import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReturnsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgDark} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Header title="" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconWrap}>
          <Ionicons name="refresh-circle-outline" size={80} color={COLORS.gold} />
          <Text style={styles.title}>Chính Sách Đổi Trả Dễ Dàng</Text>
          <Text style={styles.subtitle}>
            Chúng tôi luôn đặt sự hài lòng của bạn lên hàng đầu. Đổi trả an tâm với đặc quyền từ VELMORA.
          </Text>
        </View>

        <View style={styles.policyCard}>
          <View style={styles.policyItem}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.gold} />
            <View style={styles.policyTextWrap}>
              <Text style={styles.policyTitle}>Đổi trả trong 30 ngày</Text>
              <Text style={styles.policyDesc}>Kể từ ngày nhận hàng với bất kỳ lý do gì</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.policyItem}>
            <Ionicons name="star" size={24} color={COLORS.gold} />
            <View style={styles.policyTextWrap}>
              <Text style={styles.policyTitle}>Bảo hành trọn đời</Text>
              <Text style={styles.policyDesc}>Đánh bóng, làm mới và kiểm tra chấu đá miễn phí</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.policyItem}>
            <Ionicons name="wallet-outline" size={24} color={COLORS.gold} />
            <View style={styles.policyTextWrap}>
              <Text style={styles.policyTitle}>Hoàn tiền nhanh chóng</Text>
              <Text style={styles.policyDesc}>Tiền sẽ được hoàn về tài khoản của bạn trong 2-3 ngày làm việc</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => alert('Đã gửi yêu cầu đổi trả!')}>
          <Text style={styles.btnText}>YÊU CẦU ĐỔI TRẢ NGAY</Text>
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
