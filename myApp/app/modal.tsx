import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="diamond" size={48} color={COLORS.gold} />
      </View>
      <Text style={styles.title}>Chi Tiết Sản Phẩm</Text>
      <Text style={styles.desc}>Trang chi tiết sản phẩm sẽ được cập nhật sau</Text>
      <Link href="/" dismissTo asChild>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>VỀ TRANG CHỦ</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    backgroundColor: COLORS.bgDark,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  title: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '300',
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  desc: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  btn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: SPACING.xxxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  btnText: {
    color: COLORS.black,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
