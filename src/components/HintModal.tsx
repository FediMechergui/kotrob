import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface HintModalProps {
  visible: boolean;
  hints: { title: string; text: string; meaning?: string }[];
  hintsUsed: number;
  maxHints: number;
  onUseHint: () => void;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  visible,
  hints,
  hintsUsed,
  maxHints,
  onUseHint,
  onClose,
}) => {
  const canUseHint = hintsUsed < maxHints && hintsUsed < hints.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>💡 التلميحات</Text>
            <Text style={styles.hintsCount}>
              {hintsUsed} / {maxHints}
            </Text>
          </View>

          {/* Decorative line */}
          <View style={styles.decorativeLine}>
            <View style={styles.lineSegment} />
            <View style={styles.lineDiamond} />
            <View style={styles.lineSegment} />
          </View>

          {/* Hints list */}
          <View style={styles.hintsList}>
            {hints.slice(0, hintsUsed).map((hint, index) => (
              <View key={index} style={styles.hintItem}>
                <View style={styles.hintNumber}>
                  <Text style={styles.hintNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.hintContent}>
                  <Text style={styles.hintTitle}>{hint.title}</Text>
                  <Text style={styles.hintText}>{hint.text}</Text>
                  {hint.meaning && (
                    <Text style={styles.hintMeaning}>{hint.meaning}</Text>
                  )}
                </View>
              </View>
            ))}

            {hintsUsed === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  لم تستخدم أي تلميحات بعد
                </Text>
                <Text style={styles.emptySubtext}>
                  كل تلميح يكلفك 10 نقاط
                </Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.useHintButton,
                !canUseHint && styles.disabledButton,
              ]}
              onPress={onUseHint}
              disabled={!canUseHint}
            >
              <Text style={styles.useHintText}>
                {canUseHint ? 'استخدم تلميح (-10 نقاط)' : 'لا توجد تلميحات متاحة'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 24, 16, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3,
    borderColor: COLORS.inkGold,
    overflow: 'hidden',
    ...SHADOWS.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.parchmentDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inkGold,
  },
  title: {
    fontSize: 20,
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  hintsCount: {
    fontSize: 16,
    color: COLORS.turquoise,
    ...FONTS.arabicText,
    backgroundColor: COLORS.parchmentLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  lineSegment: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inkGold,
    marginHorizontal: SPACING.md,
  },
  lineDiamond: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.inkGold,
    transform: [{ rotate: '45deg' }],
  },
  hintsList: {
    padding: SPACING.md,
    minHeight: 150,
  },
  hintItem: {
    flexDirection: 'row-reverse',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.parchmentLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.copperAccent,
  },
  hintNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.turquoise,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  hintNumberText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  hintContent: {
    flex: 1,
  },
  hintTitle: {
    fontSize: 16,
    color: COLORS.inkBrown,
    marginBottom: SPACING.xs,
    textAlign: 'right',
    ...FONTS.arabicTitle,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'right',
    ...FONTS.arabicText,
  },
  hintMeaning: {
    fontSize: 12,
    color: COLORS.turquoise,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.copperAccent,
    marginTop: SPACING.xs,
  },
  actions: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  useHintButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  disabledButton: {
    backgroundColor: COLORS.parchmentDark,
    opacity: 0.6,
  },
  useHintText: {
    fontSize: 16,
    color: COLORS.textLight,
    ...FONTS.arabicText,
  },
  closeButton: {
    backgroundColor: COLORS.parchmentLight,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.inkBrown,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
  },
});
