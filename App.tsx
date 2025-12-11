import React, { useState } from 'react';
import { HomeScreen, GameScreen, QutrabScreen } from "./src/screens";

type Screen = "home" | "game" | "qutrab";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [startingLevel, setStartingLevel] = useState(0);

  const handleStartGame = () => {
    setStartingLevel(0);
    setCurrentScreen('game');
  };

  const handleSelectLevel = (levelIndex: number) => {
    setStartingLevel(levelIndex);
    setCurrentScreen('game');
  };

  const handleStartQutrab = () => {
    setCurrentScreen("qutrab");
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'game') {
    return <GameScreen />;
  }

  if (currentScreen === "qutrab") {
    return <QutrabScreen onBack={handleBackToHome} />;
  }

  return (
    <HomeScreen
      onStartGame={handleStartGame}
      onSelectLevel={handleSelectLevel}
      onStartQutrab={handleStartQutrab}
    />
  );
}
