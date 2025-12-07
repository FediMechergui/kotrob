import React, { useState } from 'react';
import { HomeScreen, GameScreen } from './src/screens';

type Screen = 'home' | 'game';

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

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  if (currentScreen === 'game') {
    return <GameScreen />;
  }

  return (
    <HomeScreen 
      onStartGame={handleStartGame}
      onSelectLevel={handleSelectLevel}
    />
  );
}
