import Header from '@/components/Header';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING, Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/context/AppContext';

const DEMO_VOUCHERS = [
  { id: '1', title: 'Freeship Mọi Đơn Hàng', desc: 'Sử dụng cho đơn từ 0đ', code: 'FREESHIPVK', exp: '30/06/2026', type: 'ship' },
  { id: '2', title: 'Giảm 10% Cho Nhẫn Cưới', desc: 'Giảm tối đa 1.000.000đ', code: 'WEDDING10', exp: '15/05/2026', type: 'discount' },
  { id: '3', title: 'Khách Hàng Mới', desc: 'Giảm 500k cho đơn từ 5 triệu', code: 'NEWBIE500', exp: 'Vô thời hạn', type: 'new' },
];

export default function VouchersScreen() {
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const { theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  const handleSave = (id: string) => {
    setSaved(prev => ({ ...prev, [id]: true }));
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={currentTheme.background} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]} edges={['top']}>
        <Header title="Ưu Đãi Của Tôi" showBack={true} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.promoInputRow}>
          <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Ionicons name="pricetag-outline" size={20} color={currentTheme.textMuted} />
            <Text style={[styles.placeholder, { color: currentTheme.textMuted }]}>Nhập mã khuyến mãi</Text>
          </View>
          <TouchableOpacity style={[styles.applyBtn, { backgroundColor: currentTheme.accent }]}>
            <Text style={[styles.applyBtnText, { color: isDarkMode ? COLORS.black : COLORS.white }]}>Áp Dụng</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Voucher cho bạn</Text>

        {DEMO_VOUCHERS.map((v) => (
          <View key={v.id} style={[styles.voucherCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <View style={[styles.voucherLeft, { backgroundColor: isDarkMode ? 'rgba(201, 169, 110, 0.05)' : 'rgba(92, 64, 51, 0.05)', borderRightColor: currentTheme.border }]}>
              <Ionicons 
                name={v.type === 'ship' ? 'bicycle' : v.type === 'discount' ? 'diamond' : 'gift'} 
                size={32} 
                color={currentTheme.accent} 
              />
            </View>
            <View style={styles.voucherCenter}>
              <Text style={[styles.voucherTitle, { color: currentTheme.text }]} numberOfLines={1}>{v.title}</Text>
              <Text style={[styles.voucherDesc, { color: currentTheme.textMuted }]}>{v.desc}</Text>
              <Text style={[styles.voucherExp, { color: currentTheme.accent }]}>HSD: {v.exp}</Text>
            </View>
            <View style={styles.voucherRight}>
              <TouchableOpacity 
                style={[
                  styles.saveBtn, 
                  { borderColor: currentTheme.accent },
                  saved[v.id] && [styles.savedBtn, { backgroundColor: currentTheme.border, borderColor: currentTheme.border }]
                ]}
                onPress={() => handleSave(v.id)}
                disabled={saved[v.id]}
              >
                <Text style={[
                  styles.saveBtnText, 
                  { color: currentTheme.accent },
                  saved[v.id] && [styles.savedBtnText, { color: currentTheme.textMuted }]
                ]}>
                  {saved[v.id] ? 'Đã Lưu' : 'Lưu'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Cutout punch holes for ticket effect */}
            <View style={[styles.punchHole, styles.punchTop, { backgroundColor: currentTheme.background, borderColor: currentTheme.border }]} />
            <View style={[styles.punchHole, styles.punchBottom, { backgroundColor: currentTheme.background, borderColor: currentTheme.border }]} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  safeArea: { backgroundColor: COLORS.bgDark },
  scrollContent: { padding: SPACING.lg },
  
  promoInputRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholder: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
    marginLeft: SPACING.sm,
  },
  applyBtn: {
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  applyBtnText: {
    color: COLORS.black,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
  },
  
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    position: 'relative',
  },
  voucherLeft: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.05)',
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    borderStyle: 'dashed',
  },
  voucherCenter: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  voucherTitle: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: 'bold', marginBottom: 4 },
  voucherDesc: { color: COLORS.textMuted, fontSize: FONT_SIZES.xs, marginBottom: 8 },
  voucherExp: { color: COLORS.gold, fontSize: FONT_SIZES.xs, fontWeight: '600' },
  voucherRight: {
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
  },
  savedBtn: {
    backgroundColor: COLORS.border,
    borderColor: COLORS.border,
  },
  saveBtnText: {
    color: COLORS.gold,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  savedBtnText: {
    color: COLORS.textMuted,
  },
  
  // Cutout effects
  punchHole: {
    position: 'absolute',
    left: 72, // 80 - 8
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.bgDark,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  punchTop: {
    top: -9,
    borderBottomWidth: 0,
  },
  punchBottom: {
    bottom: -9,
    borderTopWidth: 0,
  },
});
