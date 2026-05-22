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
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, Theme } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useAppContext } from '@/context/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login, theme } = useAppContext();
  const currentTheme = Theme[theme];
  const isDarkMode = theme === 'dark';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!agreed) {
      alert('Bạn phải đồng ý với các điều khoản.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      login({ uid: user.uid, name: name || 'New User', email: user.email! });
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      alert(`Lỗi đăng ký: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={currentTheme.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <Ionicons name="diamond" size={36} color={COLORS.gold} />
            <Text style={[styles.brandName, { color: currentTheme.text }]}>V E L M O R A</Text>
          </View>

          <Text style={[styles.title, { color: currentTheme.text }]}>Đăng Ký</Text>
          <Text style={[styles.subtitle, { color: currentTheme.textMuted }]}>Tạo tài khoản để trải nghiệm mua sắm tốt hơn</Text>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Họ và tên</Text>
            <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Ionicons name="person-outline" size={18} color={currentTheme.textMuted} />
              <TextInput 
                style={[styles.input, { color: currentTheme.text }]} 
                placeholder="Nhập họ và tên" 
                placeholderTextColor={currentTheme.textMuted} 
                value={name} 
                onChangeText={setName} 
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Email</Text>
            <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Ionicons name="mail-outline" size={18} color={currentTheme.textMuted} />
              <TextInput 
                style={[styles.input, { color: currentTheme.text }]} 
                placeholder="Nhập email" 
                placeholderTextColor={currentTheme.textMuted} 
                keyboardType="email-address" 
                autoCapitalize="none" 
                value={email} 
                onChangeText={setEmail} 
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Số điện thoại</Text>
            <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Ionicons name="call-outline" size={18} color={currentTheme.textMuted} />
              <TextInput 
                style={[styles.input, { color: currentTheme.text }]} 
                placeholder="Nhập số điện thoại" 
                placeholderTextColor={currentTheme.textMuted} 
                keyboardType="phone-pad" 
                value={phone} 
                onChangeText={setPhone} 
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Mật khẩu</Text>
            <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={currentTheme.textMuted} />
              <TextInput 
                style={[styles.input, { color: currentTheme.text }]} 
                placeholder="Nhập mật khẩu" 
                placeholderTextColor={currentTheme.textMuted} 
                secureTextEntry={!showPassword} 
                value={password} 
                onChangeText={setPassword} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={currentTheme.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: currentTheme.text }]}>Xác nhận mật khẩu</Text>
            <View style={[styles.inputWrap, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={currentTheme.textMuted} />
              <TextInput 
                style={[styles.input, { color: currentTheme.text }]} 
                placeholder="Nhập lại mật khẩu" 
                placeholderTextColor={currentTheme.textMuted} 
                secureTextEntry={!showPassword} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
              />
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
            <View style={[styles.checkbox, { borderColor: currentTheme.border }, agreed && styles.checkboxActive]}>
              {agreed && <Ionicons name="checkmark" size={14} color={COLORS.black} />}
            </View>
            <Text style={[styles.termsText, { color: currentTheme.textMuted }]}>
              Tôi đồng ý với <Text style={styles.termsLink}>Điều khoản</Text> và <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>

          {/* Register button */}
          <TouchableOpacity
            style={[styles.registerBtn, (!agreed || loading) && styles.registerBtnDisabled]}
            disabled={!agreed || loading}
            onPress={handleRegister}>
            <Text style={styles.registerBtnText}>{loading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHẢN'}</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: currentTheme.textMuted }]}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { backgroundColor: 'transparent' },
  header: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  content: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.huge },

  logoSection: { alignItems: 'center', marginBottom: SPACING.xxl, gap: SPACING.sm },
  brandName: { fontSize: 18, fontWeight: '200', letterSpacing: 8 },

  title: { fontSize: FONT_SIZES.xxxl, fontWeight: '300', fontStyle: 'italic', marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, marginBottom: SPACING.xxl },

  inputGroup: { marginBottom: SPACING.lg },
  inputLabel: { fontSize: FONT_SIZES.sm, fontWeight: '500', marginBottom: SPACING.sm },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,
    borderWidth: 0.5,
  },
  input: { flex: 1, fontSize: FONT_SIZES.md },

  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, marginBottom: SPACING.xxl, marginTop: SPACING.sm },
  checkbox: {
    width: 22, height: 22, borderRadius: 4,
    borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginTop: 2,
  },
  checkboxActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  termsText: { flex: 1, fontSize: FONT_SIZES.sm, lineHeight: 20 },
  termsLink: { color: COLORS.gold },

  registerBtn: { backgroundColor: COLORS.gold, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.md, alignItems: 'center', marginBottom: SPACING.xxl },
  registerBtnDisabled: { opacity: 0.5 },
  registerBtnText: { color: COLORS.black, fontSize: FONT_SIZES.md, fontWeight: '700', letterSpacing: 1.5 },

  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: FONT_SIZES.md },
  loginLink: { color: COLORS.gold, fontSize: FONT_SIZES.md, fontWeight: '600' },
});
