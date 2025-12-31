import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';
import { scaleFontSize } from '../utils/responsive';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 360;

interface ClamCardProps {
  visible: boolean;
  title: string;
  description: string;
  notes?: string[];
  onClose: () => void;
}

export const ClamCard: React.FC<ClamCardProps> = ({
  visible,
  title,
  description,
  notes = [],
  onClose,
}) => {
  if (!visible) return null;
  return (
    <View style={styles.overlay}>
      <View style={styles.cardContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {notes.length > 0 && (
          <View style={styles.notesSection}>
            {notes.map((note, idx) => (
              <Text key={idx} style={styles.noteItem}>• {note}</Text>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>إغلاق</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 350,
    backgroundColor: COLORS.parchment,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 3,
    borderColor: COLORS.inkGold,
    padding: SPACING.lg,
    ...SHADOWS.large,
    alignItems: 'center',
  },
  title: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : 24),
    color: COLORS.inkGold,
    ...FONTS.arabicTitle,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  description: {
    fontSize: scaleFontSize(isSmallDevice ? 14 : 16),
    color: COLORS.inkBrown,
    ...FONTS.arabicText,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  notesSection: {
    marginBottom: SPACING.md,
    width: '100%',
  },
  noteItem: {
    fontSize: scaleFontSize(isSmallDevice ? 12 : 14),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
    textAlign: 'right',
    marginBottom: 2,
  },
  closeButton: {
    backgroundColor: COLORS.turquoise,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.md,
  },
  closeButtonText: {
    fontSize: scaleFontSize(16),
    color: COLORS.textLight,
    ...FONTS.arabicTitle,
  },
});
