import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const diamondScale = useRef(new Animated.Value(0)).current;
  const diamondRotate = useRef(new Animated.Value(0)).current;
  const diamondOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandSlide = useRef(new Animated.Value(20)).current;
  const subOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Phase 1: Diamond appears with scale + rotation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(diamondOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(diamondScale, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(diamondRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Phase 2: Brand name slides in
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(brandSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // Phase 3: Subtitle appears
      Animated.timing(subOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      // Phase 4: Shimmer effect
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      // Phase 5: Hold then fade out
      Animated.delay(600),
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  const spin = diamondRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulseScale = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      {/* Subtle radial glow */}
      <View style={styles.glowCircle} />

      {/* Diamond icon */}
      <Animated.View
        style={[
          styles.diamondWrap,
          {
            opacity: diamondOpacity,
            transform: [
              { scale: Animated.multiply(diamondScale, pulseScale) },
              { rotate: spin },
            ],
          },
        ]}>
        <Ionicons name="diamond" size={72} color={COLORS.gold} />
      </Animated.View>

      {/* Brand name */}
      <Animated.View
        style={[
          styles.brandWrap,
          {
            opacity: brandOpacity,
            transform: [{ translateY: brandSlide }],
          },
        ]}>
        <Text style={styles.brandName}>V E L M O R A</Text>
      </Animated.View>

      {/* Subtitle */}
      <Animated.View style={{ opacity: subOpacity }}>
        <Text style={styles.brandSub}>JEWELRY HOUSE</Text>
      </Animated.View>

      {/* Bottom tagline */}
      <Animated.View style={[styles.bottomTag, { opacity: subOpacity }]}>
        <View style={styles.line} />
        <Text style={styles.tagText}>Sang trọng • Tinh tế • Vĩnh cửu</Text>
        <View style={styles.line} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(201, 169, 110, 0.06)',
  },
  diamondWrap: {
    marginBottom: 24,
  },
  brandWrap: {
    marginBottom: 8,
  },
  brandName: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '200',
    letterSpacing: 10,
  },
  brandSub: {
    color: COLORS.gold,
    fontSize: 11,
    letterSpacing: 6,
    fontWeight: '400',
  },
  bottomTag: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    width: 30,
    height: 0.5,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
  },
  tagText: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 2,
  },
});
