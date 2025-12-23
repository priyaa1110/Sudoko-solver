'use client';

import { useGameStore } from '../lib/store/gameStore';
import clsx from 'clsx';

export default function NumberPad() {
  const { selectedCell, selectedNumber, selectNumber, placeNumber, clearCell } = useGameStore();

  const handleNumberClick = (num) => {
    selectNumber(num);
    
    if (selectedCell) {
      placeNumber(selectedCell.row, selectedCell.col, num);
    }
  };

  const handleClear = () => {
    if (selectedCell) {
      clearCell(selectedCell.row, selectedCell.col);
    }
  };

  return (
    <div className="number-pad">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
        <button
          key={num}
          onClick={() => handleNumberClick(num)}
          className={clsx('number-button', {
            'number-selected': selectedNumber === num
          })}
        >
          {num}
        </button>
      ))}
      <button onClick={handleClear} className="clear-button">
        Clear
      </button>
    </div>
  );
}
