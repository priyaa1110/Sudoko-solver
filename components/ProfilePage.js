'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '../lib/auth';
import { getProfile } from '../lib/profile';
import { getUserRank } from '../lib/leaderboard';

export default function ProfilePage({ isOpen, onClose }) {
  const [profile, setProfile] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProfile();
    }
  }, [isOpen]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const user = getCurrentUser();
      if (user) {
        const profileData = await getProfile(user.uid);
        setProfile(profileData);
        
        if (profileData?.bestTime) {
          const userRank = await getUserRank(user.uid);
          setRank(userRank);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const user = getCurrentUser();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Player Profile</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : profile ? (
          <div className="profile-content">
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.displayName?.charAt(0).toUpperCase() || 'P'}
              </div>
              <h3>{user?.displayName || 'Player'}</h3>
            </div>

            <div className="profile-stats">
              <div className="profile-stat-card">
                <span className="stat-label">Games Played</span>
                <span className="stat-value">{profile.gamesPlayed || 0}</span>
              </div>

              <div className="profile-stat-card">
                <span className="stat-label">Best Time</span>
                <span className="stat-value">{formatTime(profile.bestTime)}</span>
              </div>

              {rank && (
                <div className="profile-stat-card">
                  <span className="stat-label">Global Rank</span>
                  <span className="stat-value">#{rank}</span>
                </div>
              )}

              <div className="profile-stat-card">
                <span className="stat-label">Member Since</span>
                <span className="stat-value">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p>No profile data available</p>
        )}

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
