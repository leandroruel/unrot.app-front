import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { CardWrapper } from '@/components/cards/CardWrapper';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing, Typography } from '@/constants/theme';
import type { GamePost } from '@/types';

type GameState = 'idle' | 'loading' | 'playing';

const LOADING_DURATION_MS = 3000;

interface GameCardProps {
  post: GamePost;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
}

export function GameCard({ post, onLike, onComment, onShare, onBookmark }: GameCardProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [fullscreen, setFullscreen] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const loadingInterval = useRef<ReturnType<typeof setInterval>>(null);
  const controlsOpacity = useSharedValue(0);

  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: controlsOpacity.value,
  }));

  const handlePlay = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setFullscreen(true);
    setGameState('loading');
    setLoadingPercent(0);
  }, []);

  const handleClose = useCallback(() => {
    setFullscreen(false);
    setGameState('idle');
    setLoadingPercent(0);
    controlsOpacity.value = 0;
    if (loadingInterval.current) {
      clearInterval(loadingInterval.current);
    }
  }, [controlsOpacity]);

  // Simulate loading progress
  useEffect(() => {
    if (gameState !== 'loading') return;

    const step = 100 / (LOADING_DURATION_MS / 50);
    loadingInterval.current = setInterval(() => {
      setLoadingPercent((prev) => {
        const next = prev + step;
        if (next >= 100) {
          if (loadingInterval.current) clearInterval(loadingInterval.current);
          return 100;
        }
        return next;
      });
    }, 50);

    return () => {
      if (loadingInterval.current) clearInterval(loadingInterval.current);
    };
  }, [gameState]);

  // Transition from loading → playing at 100%
  useEffect(() => {
    if (loadingPercent >= 100 && gameState === 'loading') {
      setGameState('playing');
      controlsOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.ease),
      });
      if (Platform.OS === 'ios') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [loadingPercent, gameState, controlsOpacity]);

  const handleButtonPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  return (
    <>
      {/* ── Card in feed: cover art + play button ────── */}
      <CardWrapper
        post={post}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onBookmark={onBookmark}>
        <Pressable onPress={handlePlay} style={styles.coverContainer}>
          <Image
            source={typeof post.previewImage === 'string' ? { uri: post.previewImage } : post.previewImage}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.coverOverlay} />

          <View style={styles.coverLabel}>
            <ThemedText style={[Typography.feedLabel, { color: 'rgba(255,255,255,0.8)' }]}>
              {post.label}
            </ThemedText>
          </View>

          <View style={styles.playButton}>
            <IconSymbol name="play.fill" size={32} color="#fff" />
          </View>
        </Pressable>
      </CardWrapper>

      {/* ── Fullscreen modal ─────────────────────────── */}
      <Modal
        visible={fullscreen}
        animationType="fade"
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent>
        <StatusBar hidden />
        <View style={styles.fullscreenContainer}>
          <Image
            source={typeof post.previewImage === 'string' ? { uri: post.previewImage } : post.previewImage}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />

          {/* Close button — always visible */}
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={18} color="#fff" />
          </Pressable>

          {/* ── Loading state ──────────────────────── */}
          {gameState === 'loading' && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingContent}>
                <ThemedText style={styles.loadingLabel}>LOADING</ThemedText>
                <View style={styles.loadingBarTrack}>
                  <View
                    style={[
                      styles.loadingBarFill,
                      { width: `${Math.min(loadingPercent, 100)}%` },
                    ]}
                  />
                </View>
                <ThemedText style={styles.loadingPercent}>
                  {Math.round(loadingPercent)}%
                </ThemedText>
              </View>
            </View>
          )}

          {/* ── SNES Controls — playing state ──────── */}
          {gameState === 'playing' && (
            <Animated.View style={[styles.controlsOverlay, controlsAnimatedStyle]}>
              {/* D-Pad (left) */}
              <View style={styles.dpadContainer}>
                <View style={styles.dpad}>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.dpadButton, styles.dpadUp]}>
                    <View style={[styles.triangle, styles.triangleUp]} />
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.dpadButton, styles.dpadDown]}>
                    <View style={[styles.triangle, styles.triangleDown]} />
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.dpadButton, styles.dpadLeft]}>
                    <View style={[styles.triangle, styles.triangleLeft]} />
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.dpadButton, styles.dpadRight]}>
                    <View style={[styles.triangle, styles.triangleRight]} />
                  </Pressable>
                  <View style={styles.dpadCenter} />
                </View>
              </View>

              {/* Select / Start (center-bottom) */}
              <View style={styles.centerButtons}>
                <Pressable onPressIn={handleButtonPress} style={styles.metaButton}>
                  <ThemedText style={styles.metaButtonText}>SELECT</ThemedText>
                </Pressable>
                <Pressable onPressIn={handleButtonPress} style={styles.metaButton}>
                  <ThemedText style={styles.metaButtonText}>START</ThemedText>
                </Pressable>
              </View>

              {/* XYAB diamond (right) */}
              <View style={styles.abxyContainer}>
                <View style={styles.abxyDiamond}>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.snesButton, styles.btnX]}>
                    <ThemedText style={styles.snesButtonText}>X</ThemedText>
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.snesButton, styles.btnY]}>
                    <ThemedText style={styles.snesButtonText}>Y</ThemedText>
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.snesButton, styles.btnA]}>
                    <ThemedText style={styles.snesButtonText}>A</ThemedText>
                  </Pressable>
                  <Pressable
                    onPressIn={handleButtonPress}
                    style={[styles.snesButton, styles.btnB]}>
                    <ThemedText style={styles.snesButtonText}>B</ThemedText>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </Modal>
    </>
  );
}

// ── Sizes ──────────────────────────────────────
const DPAD_SIZE = 130;
const DPAD_BTN = 42;
const SNES_BTN = 48;
const DIAMOND_OFFSET = 54;
const CTRL_ALPHA = 0.3;

const styles = StyleSheet.create({
  // ── Card cover (idle) ──────────────────────────
  coverContainer: {
    aspectRatio: 16 / 9,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  coverLabel: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3,
  },

  // ── Fullscreen ─────────────────────────────────
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },

  // ── Loading ────────────────────────────────────
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
    width: 220,
  },
  loadingLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  loadingBarTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  loadingBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#2ECC71',
  },
  loadingPercent: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Controls overlay ───────────────────────────
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  // ── D-Pad (left side) ─────────────────────────
  dpadContainer: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
  },
  dpad: {
    width: DPAD_SIZE,
    height: DPAD_SIZE,
    position: 'relative',
  },
  dpadButton: {
    position: 'absolute',
    width: DPAD_BTN,
    height: DPAD_BTN,
    borderRadius: 6,
    backgroundColor: `rgba(255, 255, 255, ${CTRL_ALPHA})`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dpadUp: {
    top: 0,
    left: (DPAD_SIZE - DPAD_BTN) / 2,
  },
  dpadDown: {
    bottom: 0,
    left: (DPAD_SIZE - DPAD_BTN) / 2,
  },
  dpadLeft: {
    top: (DPAD_SIZE - DPAD_BTN) / 2,
    left: 0,
  },
  dpadRight: {
    top: (DPAD_SIZE - DPAD_BTN) / 2,
    right: 0,
  },
  dpadCenter: {
    position: 'absolute',
    width: DPAD_BTN,
    height: DPAD_BTN,
    top: (DPAD_SIZE - DPAD_BTN) / 2,
    left: (DPAD_SIZE - DPAD_BTN) / 2,
    backgroundColor: `rgba(255, 255, 255, ${CTRL_ALPHA * 0.5})`,
    borderRadius: 4,
  },

  // D-pad arrow triangles
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
  },
  triangleUp: {
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.8)',
  },
  triangleDown: {
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
  },
  triangleLeft: {
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: 'rgba(255, 255, 255, 0.8)',
  },
  triangleRight: {
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'rgba(255, 255, 255, 0.8)',
  },

  // ── Select / Start (center) ───────────────────
  centerButtons: {
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  metaButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: `rgba(255, 255, 255, ${CTRL_ALPHA})`,
  },
  metaButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ── XYAB diamond (right side) ──────────────────
  abxyContainer: {
    width: DIAMOND_OFFSET * 2 + SNES_BTN,
    height: DIAMOND_OFFSET * 2 + SNES_BTN,
  },
  abxyDiamond: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  snesButton: {
    position: 'absolute',
    width: SNES_BTN,
    height: SNES_BTN,
    borderRadius: SNES_BTN / 2,
    backgroundColor: `rgba(255, 255, 255, ${CTRL_ALPHA})`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: `rgba(255, 255, 255, ${CTRL_ALPHA * 0.6})`,
  },
  snesButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '800',
  },
  btnX: {
    top: 0,
    left: DIAMOND_OFFSET,
  },
  btnY: {
    top: DIAMOND_OFFSET,
    left: 0,
  },
  btnA: {
    top: DIAMOND_OFFSET,
    right: 0,
  },
  btnB: {
    bottom: 0,
    left: DIAMOND_OFFSET,
  },
});
