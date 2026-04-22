import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';
import { auth } from '@/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' as 'success' | 'error' | 'info' });
  
  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertConfig({ visible: true, title, message, type });
  };
  const hideAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập đầy đủ email và mật khẩu.', 'error');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // You might want to fetch the user's name from your database here
      // For now, we'll use the email as a placeholder name
      login({ uid: user.uid, name: user.displayName || user.email!, email: user.email! });
      router.replace('/(tabs)/profile');
    } catch (error: any) {
      showAlert('Lỗi đăng nhập', error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showAlert('Thông báo', 'Vui lòng nhập Email của bạn vào ô bên trên để nhận liên kết lấy lại mật khẩu.', 'info');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showAlert('Thành công', 'Đã gửi liên kết! Vui lòng kiểm tra hộp thư email của bạn để đặt lại mật khẩu.', 'success');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        showAlert('Lỗi', 'Không tìm thấy tài khoản với email này.', 'error');
      } else {
        showAlert('Lỗi', error.message, 'error');
      }
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
          <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}>
            <Text style={styles.loginBtnText}>{loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}</Text>
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

      {/* Custom Alert Modal */}
      <Modal visible={alertConfig.visible} transparent animationType="fade" onRequestClose={hideAlert}>
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <View style={styles.alertIconWrap}>
              <Ionicons 
                name={alertConfig.type === 'success' ? 'checkmark-circle' : alertConfig.type === 'error' ? 'close-circle' : 'information-circle'} 
                size={56} 
                color={alertConfig.type === 'success' ? '#4CAF50' : alertConfig.type === 'error' ? COLORS.red : COLORS.gold} 
              />
            </View>
            <Text style={styles.alertTitle}>{alertConfig.title}</Text>
            <Text style={styles.alertMessage} textAlign="center">{alertConfig.message}</Text>
            <TouchableOpacity 
              style={[styles.alertBtn, {backgroundColor: alertConfig.type === 'success' ? '#4CAF50' : alertConfig.type === 'error' ? COLORS.red : COLORS.gold}]} 
              onPress={hideAlert}
            >
              <Text style={styles.alertBtnText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Register
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxl },
  registerText: { color: COLORS.textMuted, fontSize: FONT_SIZES.md },
  registerLink: { color: COLORS.gold, fontSize: FONT_SIZES.md, fontWeight: '600' },

  // Custom Alert Styles
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  alertBox: { backgroundColor: '#1A1A1A', width: '100%', borderRadius: BORDER_RADIUS.lg, padding: SPACING.xl, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  alertIconWrap: { marginBottom: SPACING.md },
  alertTitle: { color: COLORS.white, fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SPACING.sm, textAlign: 'center' },
  alertMessage: { color: COLORS.textSecondary, fontSize: FONT_SIZES.md, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 22 },
  alertBtn: { width: '100%', paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  alertBtnText: { color: COLORS.white, fontSize: FONT_SIZES.md, fontWeight: 'bold' },
});
