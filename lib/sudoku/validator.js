export function hasConflict(board, row, col, num) {
  if (num === 0) return false;
  
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x] === num) {
      return true;
    }
    if (x !== row && board[x][col] === num) {
      return true;
    }
  }
  
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = startRow + i;
      const c = startCol + j;
      if ((r !== row || c !== col) && board[r][c] === num) {
        return true;
      }
    }
  }
  
  return false;
}

export function isValidMove(board, row, col, num) {
  return !hasConflict(board, row, col, num);
}

export function isBoardComplete(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}

export function isBoardValid(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0 && hasConflict(board, row, col, num)) {
        return false;
      }
    }
  }
  return true;
}

export function getConflicts(board) {
  const conflicts = new Set();
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0 && hasConflict(board, row, col, num)) {
        conflicts.add(`${row}-${col}`);
      }
    }
  }
  
  return conflicts;
}
