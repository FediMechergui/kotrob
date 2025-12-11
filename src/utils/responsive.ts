import { Dimensions, PixelRatio, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (iPhone 11 / iPhone XR as reference)
const BASE_WIDTH = 414;
const BASE_HEIGHT = 896;

// Screen size categories
export const isSmallScreen = SCREEN_WIDTH < 360;
export const isMediumScreen = SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414;
export const isLargeScreen = SCREEN_WIDTH >= 414;

// Responsive scaling functions
export const scaleWidth = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const scaleHeight = (size: number): number => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Moderate scaling - doesn't scale as aggressively (good for fonts)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size + (scale - 1) * size * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Font scaling with minimum and maximum limits
export const scaleFontSize = (size: number): number => {
  const scaledSize = moderateScale(size, 0.4);
  // Ensure minimum readable size and maximum comfortable size
  const minSize = Math.max(size * 0.75, 10);
  const maxSize = size * 1.3;
  return Math.min(Math.max(scaledSize, minSize), maxSize);
};

// Percentage of screen width
export const wp = (percentage: number): number => {
  return Math.round((percentage * SCREEN_WIDTH) / 100);
};

// Percentage of screen height
export const hp = (percentage: number): number => {
  return Math.round((percentage * SCREEN_HEIGHT) / 100);
};

// Get responsive padding based on screen size
export const getResponsivePadding = (base: number): number => {
  if (isSmallScreen) return Math.round(base * 0.7);
  if (isMediumScreen) return Math.round(base * 0.85);
  return base;
};

// Get responsive margin based on screen size
export const getResponsiveMargin = (base: number): number => {
  if (isSmallScreen) return Math.round(base * 0.7);
  if (isMediumScreen) return Math.round(base * 0.85);
  return base;
};

// Screen dimensions export
export const SCREEN = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallScreen,
  isMedium: isMediumScreen,
  isLarge: isLargeScreen,
  isWeb: Platform.OS === "web",
};

// Responsive spacing that adjusts to screen size
export const RESPONSIVE_SPACING = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(16),
  lg: scaleWidth(24),
  xl: scaleWidth(32),
  xxl: scaleWidth(48),
};

// Responsive font sizes
export const RESPONSIVE_FONTS = {
  xs: scaleFontSize(10),
  sm: scaleFontSize(12),
  md: scaleFontSize(14),
  lg: scaleFontSize(16),
  xl: scaleFontSize(18),
  xxl: scaleFontSize(24),
  title: scaleFontSize(28),
  heading: scaleFontSize(32),
  display: scaleFontSize(40),
  hero: scaleFontSize(48),
};
