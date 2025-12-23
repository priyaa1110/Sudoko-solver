function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

function solveSudoku(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateFullBoard() {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  solveSudoku(board);
  return board;
}

function countSolutions(board, limit = 2) {
  let count = 0;
  
  function solve(b) {
    if (count >= limit) return;
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              solve(b);
              b[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  }
  
  const boardCopy = board.map(row => [...row]);
  solve(boardCopy);
  return count;
}

function removeNumbers(board, cellsToRemove) {
  const puzzle = board.map(row => [...row]);
  let removed = 0;
  const attempts = cellsToRemove * 3;
  
  for (let i = 0; i < attempts && removed < cellsToRemove; i++) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    
    if (puzzle[row][col] !== 0) {
      const backup = puzzle[row][col];
      puzzle[row][col] = 0;
      
      if (countSolutions(puzzle) === 1) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
  }
  
  return puzzle;
}

export function generatePuzzle(difficulty = 'medium') {
  const cellsToRemove = {
    easy: 35,
    medium: 45,
    hard: 55
  };
  
  const fullBoard = generateFullBoard();
  const puzzle = removeNumbers(fullBoard, cellsToRemove[difficulty] || 45);
  
  return {
    puzzle,
    solution: fullBoard
  };
}

export { isValid, solveSudoku };
