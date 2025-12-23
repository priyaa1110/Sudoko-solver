'use client';

import { useGameStore } from '../lib/store/gameStore';

export default function DifficultyMenu({ onStart }) {
  const { startNewGame } = useGameStore();

  const handleStart = (difficulty) => {
    startNewGame(difficulty);
    if (onStart) onStart();
  };

  return (
    <div className="difficulty-menu">
      <h1>Sudoku Solver</h1>
      <p>Select difficulty to start</p>
      
      <div className="difficulty-buttons">
        <button onClick={() => handleStart('easy')} className="difficulty-button">
          Easy
        </button>
        <button onClick={() => handleStart('medium')} className="difficulty-button">
          Medium
        </button>
        <button onClick={() => handleStart('hard')} className="difficulty-button">
          Hard
        </button>
      </div>
    </div>
  );
}
