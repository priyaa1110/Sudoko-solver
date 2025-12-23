'use client';

import { useState, useEffect } from 'react';
import { getTopScores } from '../lib/leaderboard';

export default function Leaderboard({ isOpen, onClose }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadScores();
    }
  }, [isOpen]);

  const loadScores = async () => {
    setLoading(true);
    try {
      const topScores = await getTopScores(10);
      setScores(topScores);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Leaderboard</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : scores.length === 0 ? (
          <p>No scores yet</p>
        ) : (
          <div className="leaderboard-list">
            {scores.map((score, index) => (
              <div key={score.userId} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>
                <span className="username">{score.username}</span>
                <span className="time">{formatTime(score.time)}</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
