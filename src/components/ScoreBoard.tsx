import React from 'react';
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  COLORS,
  FONTS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
} from "../constants/theme";
import {
  scaleFontSize,
  isShortScreen,
  isMediumHeight,
  hp,
} from "../utils/responsive";

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 360;
const isMediumDevice = width >= 360 && width < 414;

const getResponsiveSize = (
  base: number,
  small: number,
  medium: number,
  short?: number
) => {
  if (isShortScreen && short !== undefined) return short;
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return base;
};

interface ScoreBoardProps {
  score: number;
  level: number;
  streak: number;
  highScore: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  level,
  streak,
  highScore,
}) => {
  return (
    <View style={styles.container}>
      {/* Main Score */}
      <View style={styles.mainScoreContainer}>
        <Text style={styles.scoreLabel}>النقاط</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>المستوى</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{level}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>التتابع</Text>
          <View
            style={[
              styles.statValueContainer,
              streak > 0 && styles.streakActive,
            ]}
          >
            <Text style={[styles.statValue, streak > 0 && styles.streakText]}>
              {streak > 0 ? `🔥 ${streak}` : "0"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>أعلى نقاط</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{highScore}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: COLORS.parchmentDark,
    borderRadius: BORDER_RADIUS.md,
    padding: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs, 4),
    borderWidth: 1,
    borderColor: COLORS.inkGold,
    ...SHADOWS.small,
  },
  mainScoreContainer: {
    alignItems: "center",
    marginBottom: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs, 4),
    paddingBottom: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs, 4),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inkGold,
  },
  scoreLabel: {
    fontSize: scaleFontSize(isShortScreen ? 10 : isSmallDevice ? 11 : 12),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  scoreValue: {
    fontSize: scaleFontSize(isShortScreen ? 26 : isSmallDevice ? 30 : 36),
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  statsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: scaleFontSize(isShortScreen ? 9 : 10),
    color: COLORS.textSecondary,
    marginBottom: 2,
    ...FONTS.arabicText,
  },
  statValueContainer: {
    backgroundColor: COLORS.parchmentLight,
    paddingHorizontal: getResponsiveSize(SPACING.sm, SPACING.xs, SPACING.xs, 6),
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    minWidth: isShortScreen ? 36 : isSmallDevice ? 40 : 48,
    alignItems: "center",
  },
  statValue: {
    fontSize: scaleFontSize(isShortScreen ? 12 : isSmallDevice ? 14 : 16),
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  streakActive: {
    backgroundColor: COLORS.inkGold,
  },
  streakText: {
    color: COLORS.inkBlack,
  },
  divider: {
    width: 1,
    height: isShortScreen ? 28 : 36,
    backgroundColor: COLORS.inkGold,
    opacity: 0.5,
  },
});
