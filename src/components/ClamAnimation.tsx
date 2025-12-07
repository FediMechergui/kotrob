import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { COLORS, FONTS, SHADOWS, BORDER_RADIUS, SPACING } from '../constants/theme';

interface ClamAnimationProps {
  isOpen: boolean;
  proverb: string;
  proverbMeaning: string;
  onAnimationComplete?: () => void;
}

const { width } = Dimensions.get('window');
const CLAM_WIDTH = Math.min(width * 0.85, 340);
const CLAM_HEIGHT = CLAM_WIDTH * 0.8;

export const ClamAnimation: React.FC<ClamAnimationProps> = ({
  isOpen,
  proverb,
  proverbMeaning,
  onAnimationComplete,
}) => {
  const [animationPhase, setAnimationPhase] = useState<'closed' | 'opening' | 'open' | 'revealing'>('closed');
  
  // Animation values
  const topShellRotation = useRef(new Animated.Value(0)).current;
  const bottomShellRotation = useRef(new Animated.Value(0)).current;
  const pearlScale = useRef(new Animated.Value(0)).current;
  const pearlOpacity = useRef(new Animated.Value(0)).current;
  const pearlGlow = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const shellBounce = useRef(new Animated.Value(0)).current;
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const containerScale = useRef(new Animated.Value(0.8)).current;
  const bubbleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      runOpeningAnimation();
    } else {
      resetAnimation();
    }
  }, [isOpen]);

  const resetAnimation = () => {
    setAnimationPhase('closed');
    topShellRotation.setValue(0);
    bottomShellRotation.setValue(0);
    pearlScale.setValue(0);
    pearlOpacity.setValue(0);
    pearlGlow.setValue(0);
    textOpacity.setValue(0);
    shellBounce.setValue(0);
    sparkleOpacity.setValue(0);
    containerScale.setValue(0.8);
    bubbleAnim.setValue(0);
  };

  const runOpeningAnimation = () => {
    setAnimationPhase('opening');
    
    // Sequence of animations like a GIF
    Animated.sequence([
      // Phase 1: Container appears with bounce
      Animated.spring(containerScale, {
        toValue: 1,
        friction: 6,
        tension: 100,
        useNativeDriver: true,
      }),
      
      // Phase 2: Bubbles appear
      Animated.timing(bubbleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      
      // Phase 3: Shell shakes before opening
      Animated.sequence([
        Animated.timing(shellBounce, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shellBounce, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shellBounce, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shellBounce, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 4: Shells open
      Animated.parallel([
        Animated.timing(topShellRotation, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(bottomShellRotation, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 5: Pearl appears
      Animated.parallel([
        Animated.spring(pearlScale, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(pearlOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 6: Sparkles and glow
      Animated.parallel([
        Animated.timing(sparkleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pearlGlow, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      
      // Phase 7: Text reveals
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimationPhase('open');
      
      // Start continuous glow animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pearlGlow, {
            toValue: 1.3,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pearlGlow, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      onAnimationComplete?.();
    });
  };

  // Interpolations
  const topShellRotate = topShellRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-55deg'],
  });

  const bottomShellRotate = bottomShellRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '20deg'],
  });

  const shellShake = shellBounce.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: containerScale }] }]}>
      {/* Water/Ocean background effect */}
      <View style={styles.oceanBackground}>
        <View style={styles.wave1} />
        <View style={styles.wave2} />
      </View>
      
      {/* Bubbles */}
      <Animated.View style={[styles.bubblesContainer, { opacity: bubbleAnim }]}>
        {[...Array(6)].map((_, i) => (
          <Animated.View 
            key={i} 
            style={[
              styles.bubble,
              {
                left: 20 + (i * 50) % 200,
                bottom: 30 + (i * 20) % 80,
                width: 8 + (i % 3) * 4,
                height: 8 + (i % 3) * 4,
                opacity: bubbleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.6 - (i * 0.08)],
                }),
              }
            ]} 
          />
        ))}
      </Animated.View>
      
      {/* Clam */}
      <View style={styles.clamContainer}>
        {/* Sand/Base */}
        <View style={styles.sandBase}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.sandGrain, { left: 10 + i * 35 }]} />
          ))}
        </View>
        
        {/* Bottom Shell */}
        <Animated.View
          style={[
            styles.shell,
            styles.bottomShell,
            {
              transform: [
                { rotateX: bottomShellRotate },
                { rotateZ: shellShake },
              ],
            },
          ]}
        >
          <View style={styles.shellInner}>
            {/* Shell ridges */}
            {[...Array(9)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.shellRidge,
                  { 
                    left: `${10 + i * 10}%`,
                    height: `${60 + (i % 2) * 20}%`,
                  }
                ]} 
              />
            ))}
          </View>
          {/* Shell edge highlight */}
          <View style={styles.shellEdge} />
        </Animated.View>

        {/* Pearl with proverb */}
        <Animated.View
          style={[
            styles.pearlContainer,
            {
              opacity: pearlOpacity,
              transform: [{ scale: pearlScale }],
            },
          ]}
        >
          {/* Glow effect */}
          <Animated.View 
            style={[
              styles.pearlGlow, 
              { 
                opacity: pearlGlow.interpolate({
                  inputRange: [0, 1, 1.3],
                  outputRange: [0, 0.4, 0.6],
                }),
                transform: [{ scale: pearlGlow }],
              }
            ]} 
          />
          
          {/* Sparkles */}
          <Animated.View style={[styles.sparklesContainer, { opacity: sparkleOpacity }]}>
            {[...Array(8)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.sparkle,
                  {
                    top: 10 + Math.sin(i * 0.8) * 50,
                    left: 20 + Math.cos(i * 0.8) * 80,
                    transform: [{ rotate: `${i * 45}deg` }],
                  }
                ]} 
              />
            ))}
          </Animated.View>
          
          {/* Pearl */}
          <View style={styles.pearl}>
            <View style={styles.pearlShine} />
            <Animated.View style={{ opacity: textOpacity }}>
              <Text style={styles.proverbText}>{proverb}</Text>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <View style={styles.dividerDiamond} />
                <View style={styles.dividerLine} />
              </View>
              <Text style={styles.meaningText}>{proverbMeaning}</Text>
            </Animated.View>
          </View>
        </Animated.View>

        {/* Top Shell */}
        <Animated.View
          style={[
            styles.shell,
            styles.topShell,
            {
              transform: [
                { rotateX: topShellRotate },
                { rotateZ: shellShake },
              ],
            },
          ]}
        >
          <View style={styles.shellInner}>
            {[...Array(9)].map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.shellRidge,
                  { 
                    left: `${10 + i * 10}%`,
                    height: `${60 + (i % 2) * 20}%`,
                  }
                ]} 
              />
            ))}
          </View>
          <View style={styles.shellEdge} />
        </Animated.View>
      </View>

      {/* Title */}
      <Animated.View style={{ opacity: textOpacity }}>
        <Text style={styles.title}>🏆 مبروك! 🏆</Text>
        <Text style={styles.subtitle}>لقد أكملت المستوى</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  oceanBackground: {
    position: 'absolute',
    width: CLAM_WIDTH + 80,
    height: CLAM_HEIGHT + 150,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: '#1a5f7a',
    opacity: 0.15,
  },
  wave1: {
    position: 'absolute',
    bottom: '30%',
    width: '100%',
    height: 20,
    backgroundColor: COLORS.turquoise,
    opacity: 0.3,
    borderRadius: 10,
  },
  wave2: {
    position: 'absolute',
    bottom: '50%',
    width: '80%',
    height: 15,
    backgroundColor: COLORS.turquoise,
    opacity: 0.2,
    borderRadius: 8,
    alignSelf: 'center',
  },
  bubblesContainer: {
    position: 'absolute',
    width: CLAM_WIDTH,
    height: CLAM_HEIGHT,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  clamContainer: {
    width: CLAM_WIDTH,
    height: CLAM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sandBase: {
    position: 'absolute',
    bottom: -10,
    width: CLAM_WIDTH * 0.95,
    height: 25,
    backgroundColor: COLORS.parchmentDark,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sandGrain: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.copperAccent,
    opacity: 0.4,
  },
  shell: {
    width: CLAM_WIDTH * 0.88,
    height: CLAM_HEIGHT * 0.38,
    borderRadius: CLAM_WIDTH * 0.44,
    backgroundColor: COLORS.parchmentDark,
    borderWidth: 3,
    borderColor: COLORS.copperAccent,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  shellInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: 5,
  },
  shellRidge: {
    position: 'absolute',
    width: 6,
    backgroundColor: COLORS.inkGold,
    borderRadius: 3,
    opacity: 0.6,
  },
  shellEdge: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 8,
    backgroundColor: COLORS.copperAccent,
    opacity: 0.5,
  },
  topShell: {
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#E8D4BE',
  },
  bottomShell: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#DCC8AE',
  },
  pearlContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  pearlGlow: {
    position: 'absolute',
    width: CLAM_WIDTH * 0.9,
    height: CLAM_HEIGHT * 0.75,
    borderRadius: CLAM_WIDTH * 0.45,
    backgroundColor: COLORS.inkGoldLight,
  },
  sparklesContainer: {
    position: 'absolute',
    width: CLAM_WIDTH * 0.9,
    height: CLAM_HEIGHT * 0.8,
  },
  sparkle: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: COLORS.inkGold,
  },
  pearl: {
    width: CLAM_WIDTH * 0.82,
    minHeight: CLAM_HEIGHT * 0.55,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: COLORS.parchmentLight,
    borderWidth: 3,
    borderColor: COLORS.inkGold,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  pearlShine: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  proverbText: {
    fontSize: 17,
    color: COLORS.inkBrown,
    textAlign: 'center',
    lineHeight: 28,
    ...FONTS.arabicTitle,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
  dividerLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.inkGold,
  },
  dividerDiamond: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.inkGold,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: SPACING.xs,
  },
  meaningText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 26,
    color: COLORS.inkGold,
    marginTop: SPACING.lg,
    ...FONTS.arabicTitle,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    ...FONTS.arabicText,
  },
});
