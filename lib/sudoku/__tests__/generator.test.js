import { generatePuzzle, isValid, solveSudoku } from '../generator';

describe('Sudoku Generator', () => {
  test('generates valid easy puzzle', () => {
    const { puzzle, solution } = generatePuzzle('easy');
    
    expect(puzzle).toHaveLength(9);
    expect(solution).toHaveLength(9);
    
    let emptyCount = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) emptyCount++;
      }
    }
    
    expect(emptyCount).toBeGreaterThan(20);
    expect(emptyCount).toBeLessThan(50);
  });

  test('generates valid medium puzzle', () => {
    const { puzzle, solution } = generatePuzzle('medium');
    
    let emptyCount = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) emptyCount++;
      }
    }
    
    expect(emptyCount).toBeGreaterThan(30);
  });

  test('generates valid hard puzzle', () => {
    const { puzzle, solution } = generatePuzzle('hard');
    
    let emptyCount = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) emptyCount++;
      }
    }
    
    expect(emptyCount).toBeGreaterThan(40);
  });

  test('solution is complete and valid', () => {
    const { solution } = generatePuzzle('medium');
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        expect(solution[row][col]).toBeGreaterThan(0);
        expect(solution[row][col]).toBeLessThanOrEqual(9);
      }
    }
  });

  test('isValid correctly identifies valid placements', () => {
    const board = Array(9).fill(null).map(() => Array(9).fill(0));
    board[0][0] = 1;
    
    expect(isValid(board, 0, 1, 1)).toBe(false);
    expect(isValid(board, 1, 0, 1)).toBe(false);
    expect(isValid(board, 0, 1, 2)).toBe(true);
  });

  test('solveSudoku solves a puzzle', () => {
    const board = [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9]
    ];
    
    const result = solveSudoku(board);
    expect(result).toBe(true);
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        expect(board[row][col]).toBeGreaterThan(0);
      }
    }
  });
});
