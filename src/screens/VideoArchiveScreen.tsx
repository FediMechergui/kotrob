import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import { COLORS, FONTS } from "../constants/theme";
import { scaleFontSize, moderateScale } from "../utils/responsive";
import { getUnlockedVideos, UnlockedVideo } from "../services/database";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// All available videos
const ALL_VIDEOS = [
  {
    id: "1",
    filename: "(اتفاق اللفظ و اختلاف المعنى (ضرب_20251211_235337_0000.mp4",
    title: "اتفاق اللفظ واختلاف المعنى",
    description: "فيديو تعليمي عن اتفاق اللفظ واختلاف المعنى في اللغة العربية",
    source: require("../../assets/(اتفاق اللفظ و اختلاف المعنى (ضرب_20251211_235337_0000.mp4"),
  },
  {
    id: "2",
    filename: "في محاسن العين _20251212_175057_0000.mp4",
    title: "في محاسن العين",
    description: "فيديو تعليمي عن محاسن العين في الشعر العربي",
    source: require("../../assets/في محاسن العين _20251212_175057_0000.mp4"),
  },
];

interface VideoArchiveScreenProps {
  onBack: () => void;
  playerId?: number;
}

export const VideoArchiveScreen: React.FC<VideoArchiveScreenProps> = ({
  onBack,
  playerId,
}) => {
  const videoRef = useRef<Video>(null);
  const [unlockedVideos, setUnlockedVideos] = useState<UnlockedVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<
    (typeof ALL_VIDEOS)[0] | null
  >(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnlockedVideos();
  }, [playerId]);

  const loadUnlockedVideos = async () => {
    if (playerId) {
      const videos = await getUnlockedVideos(playerId);
      setUnlockedVideos(videos);
    }
    setLoading(false);
  };

  const isVideoUnlocked = (filename: string): boolean => {
    return unlockedVideos.some((v) => v.filename === filename);
  };

  const getVideoInfo = (filename: string): UnlockedVideo | undefined => {
    return unlockedVideos.find((v) => v.filename === filename);
  };

  const handleVideoSelect = async (video: (typeof ALL_VIDEOS)[0]) => {
    if (isVideoUnlocked(video.filename)) {
      setSelectedVideo(video);
      setShowVideoModal(true);
      setIsPlaying(true);
      setProgress(0);
    }
  };

  const handleCloseVideo = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const duration = status.durationMillis || 1;
      const position = status.positionMillis || 0;
      setProgress((position / duration) * 100);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  const renderVideoItem = ({ item }: { item: (typeof ALL_VIDEOS)[0] }) => {
    const unlocked = isVideoUnlocked(item.filename);
    const info = getVideoInfo(item.filename);

    return (
      <TouchableOpacity
        style={[styles.videoCard, !unlocked && styles.lockedCard]}
        onPress={() => handleVideoSelect(item)}
        disabled={!unlocked}
        activeOpacity={0.8}
      >
        <View style={styles.videoThumbnail}>
          {unlocked ? (
            <Text style={styles.playIcon}>▶️</Text>
          ) : (
            <Text style={styles.lockIcon}>🔒</Text>
          )}
        </View>

        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, !unlocked && styles.lockedText]}>
            {item.title}
          </Text>
          <Text
            style={[styles.videoDescription, !unlocked && styles.lockedText]}
          >
            {item.description}
          </Text>

          {unlocked && info ? (
            <View style={styles.videoMeta}>
              <Text style={styles.metaText}>
                📅 فُتح في: {formatDate(info.unlocked_at)}
              </Text>
              <Text style={styles.metaText}>
                👁️ شوهد {info.watch_count} مرة
              </Text>
            </View>
          ) : (
            <Text style={styles.lockedHint}>
              شاهد فيديو مكافأة لفتح هذا المحتوى
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const unlockedCount = unlockedVideos.length;
  const totalCount = ALL_VIDEOS.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.parchment} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>→</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>أرشيف الفيديوهات</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          فيديوهات مفتوحة: {unlockedCount} / {totalCount}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(unlockedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Video List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري التحميل...</Text>
        </View>
      ) : (
        <FlatList
          data={ALL_VIDEOS}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>لا توجد فيديوهات</Text>
            </View>
          }
        />
      )}

      {/* Video Player Modal */}
      <Modal
        visible={showVideoModal}
        animationType="fade"
        onRequestClose={handleCloseVideo}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <StatusBar hidden />

          {selectedVideo && (
            <>
              <Video
                ref={videoRef}
                source={selectedVideo.source}
                style={styles.fullScreenVideo}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                useNativeControls={false}
              />

              {/* Controls Overlay */}
              <View style={styles.controlsOverlay}>
                {/* Close Button */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseVideo}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                {/* Title */}
                <View style={styles.modalTitle}>
                  <Text style={styles.modalTitleText}>
                    {selectedVideo.title}
                  </Text>
                </View>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                  {/* Play/Pause */}
                  <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={togglePlayPause}
                  >
                    <Text style={styles.playPauseText}>
                      {isPlaying ? "⏸️" : "▶️"}
                    </Text>
                  </TouchableOpacity>

                  {/* Progress Bar */}
                  <View style={styles.modalProgressBar}>
                    <View
                      style={[
                        styles.modalProgressFill,
                        { width: `${progress}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.modalProgressText}>
                    {Math.round(progress)}%
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.parchment,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ornamentBorder,
  },
  backButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.inkBrown,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: COLORS.parchment,
    fontSize: scaleFontSize(20),
  },
  headerTitle: {
    fontSize: scaleFontSize(22),
    color: COLORS.inkBrown,
    ...FONTS.arabicTitle,
  },
  placeholder: {
    width: moderateScale(40),
  },
  progressSection: {
    padding: moderateScale(16),
    backgroundColor: COLORS.parchmentLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.ornamentBorder,
  },
  progressText: {
    fontSize: scaleFontSize(14),
    color: COLORS.inkBrown,
    textAlign: "center",
    marginBottom: 8,
    ...FONTS.arabicText,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.turquoise,
    borderRadius: 4,
  },
  listContent: {
    padding: moderateScale(16),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: scaleFontSize(16),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: {
    fontSize: scaleFontSize(16),
    color: COLORS.textSecondary,
    ...FONTS.arabicText,
  },
  videoCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.ornamentBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    backgroundColor: "#f5f5f5",
    opacity: 0.7,
  },
  videoThumbnail: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: 8,
    backgroundColor: COLORS.inkBrown,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: moderateScale(12),
  },
  playIcon: {
    fontSize: 30,
  },
  lockIcon: {
    fontSize: 30,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: scaleFontSize(16),
    color: COLORS.inkBrown,
    marginBottom: 4,
    textAlign: "right",
    ...FONTS.arabicTitle,
  },
  videoDescription: {
    fontSize: scaleFontSize(12),
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: "right",
    ...FONTS.arabicText,
  },
  lockedText: {
    color: "#999",
  },
  videoMeta: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 8,
  },
  metaText: {
    fontSize: scaleFontSize(10),
    color: COLORS.turquoise,
    ...FONTS.arabicText,
  },
  lockedHint: {
    fontSize: scaleFontSize(11),
    color: "#999",
    fontStyle: "italic",
    textAlign: "right",
    ...FONTS.arabicText,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullScreenVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  modalTitle: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 80,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
    padding: 12,
  },
  modalTitleText: {
    color: "#fff",
    fontSize: scaleFontSize(16),
    textAlign: "center",
    ...FONTS.arabicTitle,
  },
  bottomControls: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 12,
  },
  playPauseButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseText: {
    fontSize: 28,
  },
  modalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: "hidden",
  },
  modalProgressFill: {
    height: "100%",
    backgroundColor: COLORS.inkGold,
    borderRadius: 3,
  },
  modalProgressText: {
    color: "#fff",
    fontSize: scaleFontSize(12),
    minWidth: 40,
    textAlign: "center",
  },
});

export default VideoArchiveScreen;
