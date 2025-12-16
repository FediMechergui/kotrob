import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  BackHandler,
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { COLORS, FONTS } from "../constants/theme";
import { scaleFontSize } from "../utils/responsive";
import { unlockVideo, addToTotalScore } from "../utils/gameStorage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Video files in assets
const VIDEO_FILES = [
  {
    id: "1",
    filename: "(اتفاق اللفظ و اختلاف المعنى (ضرب_20251211_235337_0000.mp4",
    title: "اتفاق اللفظ واختلاف المعنى",
    source: require("../../assets/(اتفاق اللفظ و اختلاف المعنى (ضرب_20251211_235337_0000.mp4"),
  },
  {
    id: "2",
    filename: "في محاسن العين _20251212_175057_0000.mp4",
    title: "في محاسن العين",
    source: require("../../assets/في محاسن العين _20251212_175057_0000.mp4"),
  },
];

interface VideoRewardScreenProps {
  onComplete: (earnedPoints: number) => void;
  onCancel: () => void;
}

export const VideoRewardScreen: React.FC<VideoRewardScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<typeof VIDEO_FILES[0] | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showingCompletion, setShowingCompletion] = useState(false);

  // Select random video on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * VIDEO_FILES.length);
    setSelectedVideo(VIDEO_FILES[randomIndex]);
  }, []);

  // Disable back button during video
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isCompleted) {
        // Prevent going back during video
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isCompleted]);

  // Handle playback status update
  const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    setStatus(playbackStatus);

    if (playbackStatus.isLoaded) {
      const duration = playbackStatus.durationMillis || 1;
      const position = playbackStatus.positionMillis || 0;
      setProgress((position / duration) * 100);

      // Video completed
      if (playbackStatus.didJustFinish && !isCompleted) {
        handleVideoComplete();
      }
    }
  };

  // Handle video completion
  const handleVideoComplete = async () => {
    setIsCompleted(true);
    setShowingCompletion(true);

    if (selectedVideo) {
      // Unlock video in archive
      await unlockVideo(selectedVideo.filename);
      // Add bonus points
      await addToTotalScore(100);
    }

    // Show completion message for 2 seconds then return
    setTimeout(() => {
      onComplete(100);
    }, 2500);
  };

  if (!selectedVideo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  if (showingCompletion) {
    return (
      <View style={styles.completionContainer}>
        <StatusBar hidden />
        <Text style={styles.completionEmoji}>🎉</Text>
        <Text style={styles.completionTitle}>مبروك!</Text>
        <Text style={styles.completionSubtitle}>حصلت على 100 نقطة إضافية</Text>
        <Text style={styles.completionVideo}>
          تم فتح: {selectedVideo.title}
        </Text>
        <Text style={styles.completionHint}>
          يمكنك إعادة مشاهدة الفيديو من الأرشيف
        </Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <StatusBar hidden />
        
        {/* Video Player - Full Screen */}
        <Video
          ref={videoRef}
          source={selectedVideo.source}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false}
        />

        {/* Overlay with progress */}
        <View style={styles.overlay}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.videoTitle}>{selectedVideo.title}</Text>
            <Text style={styles.bonusText}>🎁 +100 نقطة عند الإكمال</Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progress)}% - لا يمكن تخطي الفيديو
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: scaleFontSize(18),
    ...FONTS.arabicText,
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 16,
  },
  videoTitle: {
    color: "#fff",
    fontSize: scaleFontSize(20),
    marginBottom: 8,
    ...FONTS.arabicTitle,
  },
  bonusText: {
    color: COLORS.inkGold,
    fontSize: scaleFontSize(16),
    ...FONTS.arabicText,
  },
  progressContainer: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 16,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.inkGold,
    borderRadius: 4,
  },
  progressText: {
    color: "#fff",
    fontSize: scaleFontSize(12),
    ...FONTS.arabicText,
  },
  completionContainer: {
    flex: 1,
    backgroundColor: COLORS.parchment,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  completionEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: scaleFontSize(36),
    color: COLORS.inkGold,
    marginBottom: 10,
    ...FONTS.arabicTitle,
  },
  completionSubtitle: {
    fontSize: scaleFontSize(20),
    color: COLORS.turquoise,
    marginBottom: 20,
    ...FONTS.arabicText,
  },
  completionVideo: {
    fontSize: scaleFontSize(16),
    color: COLORS.inkBrown,
    marginBottom: 10,
    textAlign: "center",
    ...FONTS.arabicText,
  },
  completionHint: {
    fontSize: scaleFontSize(14),
    color: COLORS.textSecondary,
    textAlign: "center",
    ...FONTS.arabicText,
  },
});

export default VideoRewardScreen;
