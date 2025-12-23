'use client';

import { useGameStore } from '../lib/store/gameStore';
import { useEffect } from 'react';

export default function GameStats() {
  const { timer, errors, hintsUsed, difficulty, incrementTimer, settings } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      incrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [incrementTimer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Difficulty:</span>
        <span className="stat-value">{difficulty}</span>
      </div>
      
      {settings.timerEnabled && (
        <div className="stat">
          <span className="stat-label">Time:</span>
          <span className="stat-value">{formatTime(timer)}</span>
        </div>
      )}
      
      {settings.errorCounterEnabled && (
        <div className="stat">
          <span className="stat-label">Errors:</span>
          <span className="stat-value">{errors}</span>
        </div>
      )}
      
      <div className="stat">
        <span className="stat-label">Hints:</span>
        <span className="stat-value">{hintsUsed}</span>
      </div>
    </div>
  );
}
