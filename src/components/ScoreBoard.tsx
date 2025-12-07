import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

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
          <View style={[styles.statValueContainer, streak > 0 && styles.streakActive]}>
            <Text style={[styles.statValue, streak > 0 && styles.streakText]}>
              {streak > 0 ? `🔥 ${streak}` : '0'}
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
    width: '100%',
    backgroundColor: COLORS.parchmentDark,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.inkGold,
    ...SHADOWS.medium,
  },
  mainScoreContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inkGold,
  },
  scoreLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  scoreValue: {
    fontSize: 42,
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    ...FONTS.arabicText,
  },
  statValueContainer: {
    backgroundColor: COLORS.parchmentLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 50,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
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
    height: 40,
    backgroundColor: COLORS.inkGold,
    opacity: 0.5,
  },
});
