'use client';

import { useGameStore } from '../lib/store/gameStore';
import { useEffect } from 'react';

export default function GameControls() {
  const {
    mode,
    setMode,
    useHint,
    autoFillCandidates,
    solvePuzzle,
    undo,
    redo,
    toggleTimer,
    timerRunning,
    history,
    historyIndex,
  } = useGameStore();

  return (
    <div className="game-controls">
      <div className="control-group">
        <button
          onClick={() => setMode(mode === 'normal' ? 'candidate' : 'normal')}
          className="control-button"
        >
          {mode === 'normal' ? 'Normal Mode' : 'Pencil Mode'}
        </button>
        
        <button onClick={autoFillCandidates} className="control-button">
          Auto Candidates
        </button>
      </div>

      <div className="control-group">
        <button 
          onClick={undo} 
          disabled={historyIndex < 0}
          className="control-button"
        >
          Undo
        </button>
        
        <button 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1}
          className="control-button"
        >
          Redo
        </button>
      </div>

      <div className="control-group">
        <button onClick={useHint} className="control-button">
          Hint
        </button>
        
        <button onClick={solvePuzzle} className="control-button">
          Solve
        </button>
      </div>

      <div className="control-group">
        <button onClick={toggleTimer} className="control-button">
          {timerRunning ? 'Pause' : 'Resume'}
        </button>
      </div>
    </div>
  );
}
