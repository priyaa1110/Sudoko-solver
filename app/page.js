'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '../lib/store/gameStore';
import { loginAnonymously, onAuthChange, getCurrentUser } from '../lib/auth';
import { createProfile, getProfile, updateBestTime, incrementGamesPlayed } from '../lib/profile';
import { addToLeaderboard } from '../lib/leaderboard';
import DifficultyMenu from '../components/DifficultyMenu';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import GameControls from '../components/GameControls';
import GameStats from '../components/GameStats';
import SettingsModal from '../components/SettingsModal';
import RoomManager from '../components/RoomManager';
import Leaderboard from '../components/Leaderboard';

export default function Home() {
  const { gameStarted, gameCompleted, timer, resetGame } = useGameStore();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      if (authUser) {
        setShowLogin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (gameCompleted && user) {
      handleGameComplete();
    }
  }, [gameCompleted, user]);

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const authUser = await loginAnonymously(username);
      const profile = await getProfile(authUser.uid);
      
      if (!profile) {
        await createProfile(authUser.uid, username);
      }
      
      setUser(authUser);
      setShowLogin(false);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGameComplete = async () => {
    if (!user) return;

    try {
      await incrementGamesPlayed(user.uid);
      const improved = await updateBestTime(user.uid, timer);
      
      if (improved) {
        await addToLeaderboard(user.uid, user.displayName, timer);
      }
    } catch (error) {
      console.error('Failed to save game result:', error);
    }
  };

  const handleNewGame = () => {
    resetGame();
  };

  if (showLogin) {
    return (
      <main className="login-screen">
        <div className="login-container">
          <h1>Sudoku Solver</h1>
          <p>Enter your username to play</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Username"
            maxLength={50}
          />
          <button onClick={handleLogin}>Start Playing</button>
        </div>
      </main>
    );
  }

  if (!gameStarted) {
    return (
      <main className="menu-screen">
        <DifficultyMenu onStart={() => {}} />
        <div className="menu-actions">
          <button onClick={() => setShowRoom(!showRoom)}>
            {showRoom ? 'Hide' : 'Show'} Multiplayer
          </button>
          <button onClick={() => setShowLeaderboard(true)}>Leaderboard</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </div>
        {showRoom && <RoomManager onRoomJoined={(code, diff) => {}} />}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      </main>
    );
  }

  return (
    <main className="game-screen">
      <div className="game-header">
        <h1>Sudoku</h1>
        <div className="header-actions">
          <button onClick={handleNewGame}>New Game</button>
          <button onClick={() => setShowSettings(true)}>Settings</button>
        </div>
      </div>

      <GameStats />
      
      <div className="game-container">
        <SudokuBoard />
      </div>

      <NumberPad />
      <GameControls />

      {gameCompleted && (
        <div className="completion-modal">
          <div className="completion-content">
            <h2>Puzzle Solved!</h2>
            <p>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            <button onClick={handleNewGame}>New Game</button>
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </main>
  );
}
