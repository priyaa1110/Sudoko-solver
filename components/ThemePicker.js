'use client';

import { useThemeStore, themes } from '../lib/store/themeStore';

export default function ThemePicker({ isOpen, onClose }) {
  const { currentTheme, setTheme } = useThemeStore();

  if (!isOpen) return null;

  const handleThemeSelect = (themeName) => {
    setTheme(themeName);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Choose Theme</h2>
        
        <div className="theme-grid">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleThemeSelect(key)}
              className={`theme-option ${currentTheme === key ? 'theme-selected' : ''}`}
              style={{
                background: theme.boardBg,
                color: theme.text,
                border: `3px solid ${currentTheme === key ? theme.buttonBg : theme.cellBorder}`,
              }}
            >
              <div className="theme-preview">
                <div 
                  className="theme-preview-cell"
                  style={{ background: theme.cellBg, border: `1px solid ${theme.cellBorderThin}` }}
                />
                <div 
                  className="theme-preview-cell"
                  style={{ background: theme.cellFixed, border: `1px solid ${theme.cellBorderThin}` }}
                />
                <div 
                  className="theme-preview-cell"
                  style={{ background: theme.cellSelected, border: `1px solid ${theme.cellBorderThin}` }}
                />
              </div>
              <span className="theme-name">{theme.name}</span>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
}
