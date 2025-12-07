import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface LetterWheelProps {
  letters: [string, string, string];
  onRotate: () => void;
  disabled?: boolean;
  isSpinning?: boolean;
}

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width * 0.7, 280);

export const LetterWheel: React.FC<LetterWheelProps> = ({ 
  letters, 
  onRotate, 
  disabled = false,
  isSpinning = false,
}) => {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [displayLetters, setDisplayLetters] = useState(letters);
  
  // Update display letters when letters prop changes (after spin)
  useEffect(() => {
    if (!isSpinning) {
      setDisplayLetters(letters);
    }
  }, [letters, isSpinning]);
  
  // Handle spinning animation
  useEffect(() => {
    if (isSpinning) {
      // Start spinning animation
      Animated.parallel([
        Animated.loop(
          Animated.timing(spinAnim, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // Stop spinning
      spinAnim.stopAnimation();
      spinAnim.setValue(0);
      scaleAnim.setValue(1);
    }
  }, [isSpinning]);
  
  const handlePress = () => {
    if (disabled || isSpinning) return;
    
    // Pulse animation on press
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    
    onRotate();
  };
  
  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      disabled={disabled || isSpinning}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.outerRing,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: isSpinning ? spin : '0deg' },
            ],
          },
        ]}
      >
        {/* Glow effect */}
        <Animated.View 
          style={[
            styles.glowEffect,
            { opacity: glowAnim },
          ]}
        />
        
        <View style={styles.innerRing}>
          <View style={styles.wheelContent}>
            {/* Decorative pattern */}
            <View style={styles.decorativeTop}>
              <View style={styles.decorDot} />
              <View style={styles.decorLine} />
              <View style={styles.decorDot} />
            </View>
            
            {/* Letters display */}
            <View style={styles.lettersContainer}>
              {displayLetters.map((letter, index) => (
                <Animated.View 
                  key={`${letter}-${index}`} 
                  style={[
                    styles.letterBox,
                    isSpinning && styles.letterBoxSpinning,
                  ]}
                >
                  <Text style={[
                    styles.letterText,
                    isSpinning && styles.letterTextSpinning,
                  ]}>
                    {isSpinning ? '؟' : letter}
                  </Text>
                </Animated.View>
              ))}
            </View>
            
            {/* Rotate instruction */}
            <Text style={styles.rotateText}>
              {isSpinning ? 'جاري التدوير...' : 'اضغط لحروف جديدة 🔄'}
            </Text>
            
            {/* Decorative pattern */}
            <View style={styles.decorativeBottom}>
              <View style={styles.decorDot} />
              <View style={styles.decorLine} />
              <View style={styles.decorDot} />
            </View>
          </View>
        </View>
      </Animated.View>
      
      {/* Corner decorations */}
      <View style={[styles.cornerDecoration, styles.topLeft]} />
      <View style={[styles.cornerDecoration, styles.topRight]} />
      <View style={[styles.cornerDecoration, styles.bottomLeft]} />
      <View style={[styles.cornerDecoration, styles.bottomRight]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    backgroundColor: COLORS.inkGold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.goldBorder,
    ...SHADOWS.large,
  },
  innerRing: {
    width: WHEEL_SIZE - 20,
    height: WHEEL_SIZE - 20,
    borderRadius: (WHEEL_SIZE - 20) / 2,
    backgroundColor: COLORS.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.copperAccent,
  },
  wheelContent: {
    width: WHEEL_SIZE - 40,
    height: WHEEL_SIZE - 40,
    borderRadius: (WHEEL_SIZE - 40) / 2,
    backgroundColor: COLORS.parchmentLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.inkGold,
  },
  decorativeTop: {
    position: 'absolute',
    top: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  decorativeBottom: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lettersContainer: {
    flexDirection: 'row-reverse', // RTL for Arabic
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  letterBox: {
    width: 55,
    height: 55,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.inkBrown,
    ...SHADOWS.small,
  },
  letterText: {
    fontSize: 36,
    color: COLORS.inkBrown,
    ...FONTS.arabicLetter,
  },
  rotateText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  glowEffect: {
    position: 'absolute',
    width: WHEEL_SIZE + 20,
    height: WHEEL_SIZE + 20,
    borderRadius: (WHEEL_SIZE + 20) / 2,
    backgroundColor: COLORS.inkGold,
    opacity: 0.3,
  },
  decorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.inkGold,
  },
  decorLine: {
    width: 30,
    height: 3,
    backgroundColor: COLORS.inkGold,
    marginHorizontal: 5,
    borderRadius: 2,
  },
  letterBoxSpinning: {
    backgroundColor: COLORS.inkGold,
    opacity: 0.7,
  },
  letterTextSpinning: {
    color: COLORS.parchment,
    fontSize: 28,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.inkGold,
    borderWidth: 2,
  },
  topLeft: {
    top: -5,
    left: -5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: BORDER_RADIUS.sm,
  },
  topRight: {
    top: -5,
    right: -5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: BORDER_RADIUS.sm,
  },
  bottomLeft: {
    bottom: -5,
    left: -5,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: BORDER_RADIUS.sm,
  },
  bottomRight: {
    bottom: -5,
    right: -5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: BORDER_RADIUS.sm,
  },
});
