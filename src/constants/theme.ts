// Old Arabic Manuscript Theme Colors
export const COLORS = {
  // Primary - Old parchment/paper colors
  parchment: '#F5E6D3',
  parchmentLight: '#FDF8F3',
  parchmentDark: '#E8D4BE',
  
  // Secondary - Traditional Arabic ink colors
  inkBrown: '#4A3728',
  inkBlack: '#2C1810',
  inkGold: '#C4A35A',
  inkGoldLight: '#D4B86A',
  
  // Accent - Traditional Islamic art colors
  turquoise: '#1E8A8A',
  turquoiseLight: '#2BA5A5',
  burgundy: '#722F37',
  burgundyLight: '#8B3A44',
  
  // Decorative
  goldBorder: '#B8860B',
  copperAccent: '#B87333',
  
  // Feedback colors
  correct: '#2E7D32',
  correctLight: '#4CAF50',
  incorrect: '#C62828',
  incorrectLight: '#EF5350',
  
  // Text
  textPrimary: '#2C1810',
  textSecondary: '#5D4037',
  textLight: '#F5E6D3',
  
  // Shadows
  shadow: 'rgba(44, 24, 16, 0.3)',
  shadowLight: 'rgba(44, 24, 16, 0.15)',
};

export const FONTS = {
  // We'll use system fonts with Arabic support
  arabicTitle: {
    fontFamily: 'serif',
    fontWeight: 'bold' as const,
  },
  arabicText: {
    fontFamily: 'serif',
    fontWeight: 'normal' as const,
  },
  arabicLetter: {
    fontFamily: 'serif',
    fontWeight: 'bold' as const,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.inkBlack,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.inkBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.inkBlack,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
};
