'use client';

import { useGameStore } from '../lib/store/gameStore';
import { hasConflict } from '../lib/sudoku/validator';
import clsx from 'clsx';

export default function SudokuBoard() {
  const { 
    board, 
    initialBoard, 
    selectedCell, 
    selectedNumber,
    selectCell, 
    placeNumber,
    mode,
    candidates,
    settings,
    hintCell
  } = useGameStore();

  if (!board) return null;

  const handleCellClick = (row, col) => {
    if (initialBoard[row][col] !== 0) return;
    selectCell(row, col);
    
    if (selectedNumber !== null) {
      placeNumber(row, col, selectedNumber);
    }
  };

  const isInSameRow = (row, col) => selectedCell && selectedCell.row === row;
  const isInSameCol = (row, col) => selectedCell && selectedCell.col === col;
  const isInSameBox = (row, col) => {
    if (!selectedCell) return false;
    const boxRow = Math.floor(selectedCell.row / 3);
    const boxCol = Math.floor(selectedCell.col / 3);
    return Math.floor(row / 3) === boxRow && Math.floor(col / 3) === boxCol;
  };

  const isSelected = (row, col) => {
    return selectedCell && selectedCell.row === row && selectedCell.col === col;
  };

  const hasIdenticalNumber = (row, col) => {
    if (!selectedCell || board[row][col] === 0) return false;
    const selectedValue = board[selectedCell.row][selectedCell.col];
    return selectedValue !== 0 && board[row][col] === selectedValue;
  };

  const cellHasConflict = (row, col) => {
    const num = board[row][col];
    return num !== 0 && hasConflict(board, row, col, num);
  };

  const isHintCell = (row, col) => {
    return hintCell && hintCell.row === row && hintCell.col === col;
  };

  return (
    <div className="sudoku-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isFixed = initialBoard[rowIndex][colIndex] !== 0;
            const cellKey = `${rowIndex}-${colIndex}`;
            const cellCandidates = candidates[cellKey] || [];
            
            return (
              <div
                key={colIndex}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={clsx('cell', {
                  'cell-fixed': isFixed,
                  'cell-selected': isSelected(rowIndex, colIndex),
                  'cell-highlight-row': settings.highlightRow && isInSameRow(rowIndex, colIndex),
                  'cell-highlight-col': settings.highlightColumn && isInSameCol(rowIndex, colIndex),
                  'cell-highlight-box': settings.highlightBox && isInSameBox(rowIndex, colIndex),
                  'cell-identical': settings.highlightIdentical && hasIdenticalNumber(rowIndex, colIndex),
                  'cell-conflict': cellHasConflict(rowIndex, colIndex),
                  'cell-hint': isHintCell(rowIndex, colIndex),
                  'cell-border-right': (colIndex + 1) % 3 === 0 && colIndex !== 8,
                  'cell-border-bottom': (rowIndex + 1) % 3 === 0 && rowIndex !== 8,
                })}
              >
                {cell !== 0 ? (
                  <span className="cell-number">{cell}</span>
                ) : cellCandidates.length > 0 ? (
                  <div className="cell-candidates">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <span key={num} className={clsx('candidate', {
                        'candidate-active': cellCandidates.includes(num)
                      })}>
                        {cellCandidates.includes(num) ? num : ''}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
