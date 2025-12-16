import React, { useState, useEffect } from "react";
import { HomeScreen, GameScreen, QutrabScreen } from "./src/screens";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { VideoRewardScreen } from "./src/screens/VideoRewardScreen";
import { VideoArchiveScreen } from "./src/screens/VideoArchiveScreen";
import {
  isFirstLaunch,
  getPlayerName,
  hasActiveGame,
} from "./src/utils/gameStorage";

type Screen =
  | "welcome"
  | "home"
  | "game"
  | "qutrab"
  | "videoReward"
  | "videoArchive";
type RewardContext = "roots" | "qutrab" | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [startingLevel, setStartingLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [rewardContext, setRewardContext] = useState<RewardContext>(null);
  const [resumeRoots, setResumeRoots] = useState(false);
  const [resumeQutrab, setResumeQutrab] = useState(false);

  // Check if first launch on app start
  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        setCurrentScreen("welcome");
      } else {
        const name = await getPlayerName();
        setPlayerName(name);

        // Check for active games
        const activeGame = await hasActiveGame();
        setResumeRoots(activeGame.roots);
        setResumeQutrab(activeGame.qutrab);
      }
    } catch (error) {
      console.error("Error checking first launch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWelcomeComplete = (name: string) => {
    setPlayerName(name);
    setCurrentScreen("home");
  };

  const handleStartGame = (resume: boolean = false) => {
    setStartingLevel(0);
    setResumeRoots(resume);
    setCurrentScreen("game");
  };

  const handleSelectLevel = (levelIndex: number) => {
    setStartingLevel(levelIndex);
    setResumeRoots(false);
    setCurrentScreen("game");
  };

  const handleStartQutrab = (resume: boolean = false) => {
    setResumeQutrab(resume);
    setCurrentScreen("qutrab");
  };

  const handleBackToHome = async () => {
    // Refresh active game status
    const activeGame = await hasActiveGame();
    setResumeRoots(activeGame.roots);
    setResumeQutrab(activeGame.qutrab);
    setCurrentScreen("home");
  };

  const handleOpenVideoReward = (context: RewardContext) => {
    setRewardContext(context);
    setCurrentScreen("videoReward");
  };

  const handleVideoRewardComplete = (earnedPoints: number) => {
    // Return to the game that triggered the reward
    if (rewardContext === "roots") {
      setCurrentScreen("game");
    } else if (rewardContext === "qutrab") {
      setCurrentScreen("qutrab");
    } else {
      setCurrentScreen("home");
    }
    setRewardContext(null);
  };

  const handleVideoRewardCancel = () => {
    if (rewardContext === "roots") {
      setCurrentScreen("game");
    } else if (rewardContext === "qutrab") {
      setCurrentScreen("qutrab");
    } else {
      setCurrentScreen("home");
    }
    setRewardContext(null);
  };

  const handleOpenVideoArchive = () => {
    setCurrentScreen("videoArchive");
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  if (currentScreen === "welcome") {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (currentScreen === "videoReward") {
    return (
      <VideoRewardScreen
        onComplete={handleVideoRewardComplete}
        onCancel={handleVideoRewardCancel}
      />
    );
  }

  if (currentScreen === "videoArchive") {
    return <VideoArchiveScreen onBack={handleBackToHome} />;
  }

  if (currentScreen === "game") {
    return (
      <GameScreen
        onBack={handleBackToHome}
        onOpenVideoReward={() => handleOpenVideoReward("roots")}
        resumeGame={resumeRoots}
      />
    );
  }

  if (currentScreen === "qutrab") {
    return (
      <QutrabScreen
        onBack={handleBackToHome}
        onOpenVideoReward={() => handleOpenVideoReward("qutrab")}
        resumeGame={resumeQutrab}
      />
    );
  }

  return (
    <HomeScreen
      onStartGame={handleStartGame}
      onSelectLevel={handleSelectLevel}
      onStartQutrab={handleStartQutrab}
      onOpenVideoArchive={handleOpenVideoArchive}
      playerName={playerName}
      hasActiveRootsGame={resumeRoots}
      hasActiveQutrabGame={resumeQutrab}
    />
  );
}
