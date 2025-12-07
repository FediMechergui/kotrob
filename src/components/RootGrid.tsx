import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface RootOption {
  root: string;
  isValid: boolean;
  isSelected: boolean;
  isRevealed: boolean;
}

interface RootGridProps {
  options: RootOption[];
  onSelectRoot: (root: string) => void;
  disabled?: boolean;
}

const { width } = Dimensions.get('window');
const GRID_PADDING = SPACING.lg;
const ITEM_MARGIN = SPACING.sm;
const ITEMS_PER_ROW = 3;
const ITEM_WIDTH = (width - (GRID_PADDING * 2) - (ITEM_MARGIN * (ITEMS_PER_ROW + 1))) / ITEMS_PER_ROW;

export const RootGrid: React.FC<RootGridProps> = ({ 
  options, 
  onSelectRoot, 
  disabled = false 
}) => {
  const getItemStyle = (option: RootOption) => {
    if (option.isRevealed) {
      if (option.isValid) {
        return option.isSelected ? styles.correctSelected : styles.correctNotSelected;
      } else {
        return option.isSelected ? styles.incorrectSelected : styles.normalItem;
      }
    }
    return option.isSelected ? styles.selectedItem : styles.normalItem;
  };

  const getTextStyle = (option: RootOption) => {
    if (option.isRevealed) {
      if (option.isValid && option.isSelected) {
        return styles.correctText;
      } else if (!option.isValid && option.isSelected) {
        return styles.incorrectText;
      } else if (option.isValid && !option.isSelected) {
        return styles.missedText;
      }
    }
    return option.isSelected ? styles.selectedText : styles.normalText;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الجذور المحتملة</Text>
      <Text style={styles.subtitle}>اختر الجذور الصحيحة</Text>
      
      <View style={styles.grid}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={`${option.root}-${index}`}
            style={[styles.item, getItemStyle(option)]}
            onPress={() => onSelectRoot(option.root)}
            disabled={disabled || option.isRevealed}
            activeOpacity={0.7}
          >
            <Text style={[styles.rootText, getTextStyle(option)]}>
              {option.root}
            </Text>
            {option.isRevealed && option.isValid && (
              <Text style={styles.checkmark}>✓</Text>
            )}
            {option.isRevealed && !option.isValid && option.isSelected && (
              <Text style={styles.crossmark}>✗</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: GRID_PADDING,
  },
  title: {
    fontSize: 22,
    color: COLORS.inkBrown,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    ...FONTS.arabicTitle,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    ...FONTS.arabicText,
  },
  grid: {
    flexDirection: 'row-reverse', // RTL
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: ITEM_MARGIN,
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 0.8,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    position: 'relative',
  },
  normalItem: {
    backgroundColor: COLORS.parchmentLight,
    borderColor: COLORS.inkBrown,
    ...SHADOWS.small,
  },
  selectedItem: {
    backgroundColor: COLORS.inkGold,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.medium,
  },
  correctSelected: {
    backgroundColor: COLORS.correctLight,
    borderColor: COLORS.correct,
    ...SHADOWS.small,
  },
  correctNotSelected: {
    backgroundColor: COLORS.parchment,
    borderColor: COLORS.correct,
    borderStyle: 'dashed',
  },
  incorrectSelected: {
    backgroundColor: COLORS.incorrectLight,
    borderColor: COLORS.incorrect,
    ...SHADOWS.small,
  },
  rootText: {
    fontSize: 28,
    ...FONTS.arabicLetter,
  },
  normalText: {
    color: COLORS.inkBrown,
  },
  selectedText: {
    color: COLORS.inkBlack,
  },
  correctText: {
    color: '#FFFFFF',
  },
  incorrectText: {
    color: '#FFFFFF',
  },
  missedText: {
    color: COLORS.correct,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  crossmark: {
    position: 'absolute',
    top: 5,
    right: 5,
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
