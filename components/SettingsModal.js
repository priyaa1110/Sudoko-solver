'use client';

import { useGameStore } from '../lib/store/gameStore';

export default function SettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings } = useGameStore();

  if (!isOpen) return null;

  const handleToggle = (key) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>
        
        <div className="settings-list">
          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.timerEnabled}
              onChange={() => handleToggle('timerEnabled')}
            />
            <span>Enable Timer</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.errorCounterEnabled}
              onChange={() => handleToggle('errorCounterEnabled')}
            />
            <span>Enable Error Counter</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.checkOnEntry}
              onChange={() => handleToggle('checkOnEntry')}
            />
            <span>Check Guesses on Entry</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.highlightRow}
              onChange={() => handleToggle('highlightRow')}
            />
            <span>Highlight Row</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.highlightColumn}
              onChange={() => handleToggle('highlightColumn')}
            />
            <span>Highlight Column</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.highlightBox}
              onChange={() => handleToggle('highlightBox')}
            />
            <span>Highlight Box</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.highlightIdentical}
              onChange={() => handleToggle('highlightIdentical')}
            />
            <span>Highlight Identical Numbers</span>
          </label>

          <label className="setting-item">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={() => handleToggle('soundEnabled')}
            />
            <span>Enable Sound</span>
          </label>
        </div>

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
