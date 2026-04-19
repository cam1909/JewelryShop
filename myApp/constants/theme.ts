/**
 * VELMORA Jewelry House - Theme Configuration
 * Premium jewelry mobile app design system
 */

import { Platform } from 'react-native';

// Brand Colors
export const COLORS = {
  // Primary - Deep luxury black/dark
  primary: '#1A1A1A',
  primaryDark: '#0D0D0D',
  primaryLight: '#2D2D2D',

  // Accent - Gold tones
  gold: '#C9A96E',
  goldLight: '#D4BC8A',
  goldDark: '#B8944F',
  goldMuted: '#A68B5B',

  // Background
  bgDark: '#0F0F0F',
  bgCard: '#1A1A1A',
  bgCardLight: '#222222',
  bgOverlay: 'rgba(0, 0, 0, 0.6)',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textMuted: '#777777',
  textGold: '#C9A96E',

  // Accent colors
  white: '#FFFFFF',
  black: '#000000',
  red: '#E74C3C',
  green: '#2ECC71',
  pink: '#F8E8E8',

  // Status
  sale: '#E74C3C',
  newBadge: '#C9A96E',
  outOfStock: '#777777',

  // Borders
  border: '#333333',
  borderLight: '#444444',

  // Tab bar
  tabBarBg: '#111111',
  tabBarActive: '#C9A96E',
  tabBarInactive: '#666666',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 36,
  display: 42,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  gold: {
    shadowColor: '#C9A96E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Legacy support
export const Colors = {
  light: {
    text: '#FFFFFF',
    background: '#0F0F0F',
    tint: '#C9A96E',
    icon: '#B0B0B0',
    tabIconDefault: '#666666',
    tabIconSelected: '#C9A96E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#0F0F0F',
    tint: '#C9A96E',
    icon: '#B0B0B0',
    tabIconDefault: '#666666',
    tabIconSelected: '#C9A96E',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Theme = {
  light: {
    background: '#FFFFFF',
    card: '#F5F5F5',
    text: '#1A1A1A',
    textMuted: '#666666',
    border: '#E5E5E5',
    tabBarBg: '#FFFFFF',
    tabBarActive: '#C9A96E',
    tabBarInactive: '#999999',
  },
  dark: {
    background: '#0F0F0F',
    card: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#777777',
    border: '#333333',
    tabBarBg: '#111111',
    tabBarActive: '#C9A96E',
    tabBarInactive: '#666666',
  },
};
