import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';
import {
  scaleFontSize,
  hp,
  isShortScreen,
  isMediumHeight,
} from "../utils/responsive";

interface RootOption {
  root: string;
  isValid: boolean;
  isSelected: boolean;
  isRevealed: boolean;
}

interface RootGridProps {
  options: RootOption[];
  onSelectRoot: (root: string) => void;
  onRootPress?: (root: string) => void; // For showing definition on tap after reveal
  disabled?: boolean;
}

const { width, height } = Dimensions.get("window");
const isSmallDevice = width < 360;
const isMediumDevice = width >= 360 && width < 414;
const isShortDevice = height < 700;

// Height-aware grid calculations - 5 items layout (3 top row, 2 bottom row centered)
const GRID_PADDING = isSmallDevice ? SPACING.xs : SPACING.sm;
const ITEM_MARGIN = isShortScreen ? 4 : isSmallDevice ? SPACING.xs : SPACING.sm;
const ITEMS_PER_ROW = 3; // Maximum items per row

// Calculate item width based on both width and height
const getItemWidth = () => {
  const widthBased =
    (width - GRID_PADDING * 2 - ITEM_MARGIN * (ITEMS_PER_ROW + 1)) /
    ITEMS_PER_ROW;
  const maxByHeight = isShortScreen ? hp(9) : isMediumHeight ? hp(10) : 85;
  return Math.min(widthBased, maxByHeight);
};

const ITEM_WIDTH = getItemWidth();

export const RootGrid: React.FC<RootGridProps> = ({
  options,
  onSelectRoot,
  onRootPress,
  disabled = false,
}) => {
  const getItemStyle = (option: RootOption) => {
    if (option.isRevealed) {
      if (option.isValid) {
        return option.isSelected
          ? styles.correctSelected
          : styles.correctNotSelected;
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

  const handlePress = (option: RootOption) => {
    if (option.isRevealed && option.isValid && onRootPress) {
      // After reveal, clicking valid roots shows definition
      onRootPress(option.root);
    } else if (!option.isRevealed && !disabled) {
      onSelectRoot(option.root);
    }
  };

  // Split options into rows: first 3, then remaining 2 centered
  const firstRow = options.slice(0, 3);
  const secondRow = options.slice(3, 6); // Adjusted to support up to 3 items

  return (
    <View style={styles.container}>
      <Text style={styles.title}>الجذور المحتملة</Text>
      <Text style={styles.subtitle}>اختر الجذور الصحيحة</Text>
      {/* First row - 3 items */}
      <View style={styles.row}>
        {firstRow.map((option, index) => (
          <TouchableOpacity
            key={`${option.root}-${index}`}
            style={[styles.item, getItemStyle(option)]}
            onPress={() => handlePress(option)}
            disabled={disabled && !option.isRevealed}
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
            {option.isRevealed && option.isValid && (
              <Text style={styles.tapHint}>👆</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {/* Second row - 2 items centered */}
      <View style={[styles.row]}>
        {secondRow.map((option, index) => (
          <TouchableOpacity
            key={`${option.root}-${index + 3}`}
            style={[styles.item, getItemStyle(option)]}
            onPress={() => handlePress(option)}
            disabled={disabled && !option.isRevealed}
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
            {option.isRevealed && option.isValid && (
              <Text style={styles.tapHint}>👆</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: GRID_PADDING,
  },
  title: {
    fontSize: scaleFontSize(isShortScreen ? 14 : isSmallDevice ? 15 : 18),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: 1,
    ...FONTS.arabicTitle,
  },
  subtitle: {
    fontSize: scaleFontSize(isShortScreen ? 10 : 11),
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: isShortScreen ? 4 : SPACING.xs,
    ...FONTS.arabicText,
  },
  row: {
    flexDirection: "row-reverse", // RTL
    justifyContent: "center",
    gap: ITEM_MARGIN,
    marginBottom: ITEM_MARGIN,
  },
  centerRow: {
    paddingHorizontal: ITEM_WIDTH / 2 + ITEM_MARGIN,
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * (isShortScreen ? 0.8 : 0.85),
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: isSmallDevice ? 1 : 1.5,
    position: "relative",
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
    borderStyle: "dashed",
  },
  incorrectSelected: {
    backgroundColor: COLORS.incorrectLight,
    borderColor: COLORS.incorrect,
    ...SHADOWS.small,
  },
  rootText: {
    fontSize: scaleFontSize(isSmallDevice ? 20 : isShortDevice ? 22 : 26),
    ...FONTS.arabicLetter,
  },
  normalText: {
    color: COLORS.inkBrown,
  },
  selectedText: {
    color: COLORS.inkBlack,
  },
  correctText: {
    color: "#FFFFFF",
  },
  incorrectText: {
    color: "#FFFFFF",
  },
  missedText: {
    color: COLORS.correct,
  },
  checkmark: {
    position: "absolute",
    top: 2,
    right: 2,
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  crossmark: {
    position: "absolute",
    top: 2,
    right: 2,
    fontSize: scaleFontSize(isSmallDevice ? 10 : 12),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  tapHint: {
    position: "absolute",
    bottom: 2,
    fontSize: 10,
  },
});
