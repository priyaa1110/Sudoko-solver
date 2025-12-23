function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) {
      return false;
    }
  }
  
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  
  return true;
}

export function solve(board) {
  const solution = board.map(row => [...row]);
  
  function solveHelper() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (solution[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(solution, row, col, num)) {
              solution[row][col] = num;
              if (solveHelper()) {
                return true;
              }
              solution[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }
  
  solveHelper();
  return solution;
}

export function getHint(board, solution) {
  const emptyCells = [];
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length === 0) return null;
  
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return {
    row: randomCell.row,
    col: randomCell.col,
    value: solution[randomCell.row][randomCell.col]
  };
}

export function getCandidates(board, row, col) {
  if (board[row][col] !== 0) return [];
  
  const candidates = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
  for (let x = 0; x < 9; x++) {
    candidates.delete(board[row][x]);
    candidates.delete(board[x][col]);
  }
  
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      candidates.delete(board[startRow + i][startCol + j]);
    }
  }
  
  return Array.from(candidates).sort();
}

export function getAllCandidates(board) {
  const candidates = {};
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const key = `${row}-${col}`;
        candidates[key] = getCandidates(board, row, col);
      }
    }
  }
  
  return candidates;
}
