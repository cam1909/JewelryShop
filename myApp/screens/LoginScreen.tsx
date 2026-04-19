import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Vui lòng nhập email và mật khẩu.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // You might want to fetch the user's name from your database here
      // For now, we'll use the email as a placeholder name
      login({ name: user.displayName || user.email!, email: user.email! });
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      alert(`Lỗi đăng nhập: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.diamondWrap}>
              <Ionicons name="diamond" size={48} color={COLORS.gold} />
            </View>
            <Text style={styles.brandName}>V E L M O R A</Text>
            <Text style={styles.brandSub}>JEWELRY HOUSE</Text>
          </View>

          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Nhập email của bạn"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu"
                placeholderTextColor={COLORS.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginBtnText}>{loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login */}
          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-google" size={20} color={COLORS.white} />
            <Text style={styles.socialBtnText}>Đăng nhập với Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={styles.socialBtnText}>Đăng nhập với Facebook</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safeArea: { backgroundColor: '#000' },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  content: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.huge },

  // Logo
  logoSection: { alignItems: 'center', marginBottom: SPACING.xxxl, marginTop: SPACING.xl },
  diamondWrap: { marginBottom: SPACING.lg },
  brandName: { color: COLORS.white, fontSize: 22, fontWeight: '200', letterSpacing: 8 },
  brandSub: { color: COLORS.gold, fontSize: 10, letterSpacing: 5, marginTop: 4 },

  title: { color: COLORS.white, fontSize: FONT_SIZES.xxxl, fontWeight: '300', fontStyle: 'italic', marginBottom: SPACING.sm },
  subtitle: { color: COLORS.textMuted, fontSize: FONT_SIZES.md, marginBottom: SPACING.xxxl },

  // Input
  inputGroup: { marginBottom: SPACING.xl },
  inputLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZES.sm, fontWeight: '500', marginBottom: SPACING.sm },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.bgCard, borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  input: { flex: 1, color: COLORS.white, fontSize: FONT_SIZES.md },

  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING.xxl },
  forgotText: { color: COLORS.gold, fontSize: FONT_SIZES.sm },

  loginBtn: {
    backgroundColor: COLORS.gold, paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginBottom: SPACING.xxl,
  },
  loginBtnDisabled: {
    opacity: 0.5,
  },
  loginBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1.5 },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, marginBottom: SPACING.xxl },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.textMuted, fontSize: FONT_SIZES.sm },

  // Social
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md, marginBottom: SPACING.md,
  },
  socialBtnText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: '400' },

  // Register
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxl },
  registerText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md },
  registerLink: { color: COLORS.gold, fontSize: FONT_SIZES.md, fontWeight: '600' },
});
