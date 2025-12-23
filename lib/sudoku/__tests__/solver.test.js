import { solve, getHint, getCandidates, getAllCandidates } from '../solver';

describe('Sudoku Solver', () => {
  const testBoard = [
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

  test('solve returns complete solution', () => {
    const solution = solve(testBoard);
    
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        expect(solution[row][col]).toBeGreaterThan(0);
        expect(solution[row][col]).toBeLessThanOrEqual(9);
      }
    }
  });

  test('solve does not modify original board', () => {
    const original = testBoard.map(row => [...row]);
    solve(testBoard);
    
    expect(testBoard).toEqual(original);
  });

  test('getHint returns valid hint', () => {
    const solution = solve(testBoard);
    const hint = getHint(testBoard, solution);
    
    expect(hint).not.toBeNull();
    expect(hint.row).toBeGreaterThanOrEqual(0);
    expect(hint.row).toBeLessThan(9);
    expect(hint.col).toBeGreaterThanOrEqual(0);
    expect(hint.col).toBeLessThan(9);
    expect(hint.value).toBeGreaterThan(0);
    expect(hint.value).toBeLessThanOrEqual(9);
  });

  test('getHint returns null for complete board', () => {
    const completeBoard = Array(9).fill(null).map((_, i) => 
      Array(9).fill(null).map((_, j) => ((i * 3 + Math.floor(i / 3) + j) % 9) + 1)
    );
    
    const hint = getHint(completeBoard, completeBoard);
    expect(hint).toBeNull();
  });

  test('getCandidates returns valid candidates', () => {
    const candidates = getCandidates(testBoard, 0, 2);
    
    expect(Array.isArray(candidates)).toBe(true);
    expect(candidates.length).toBeGreaterThan(0);
    candidates.forEach(num => {
      expect(num).toBeGreaterThan(0);
      expect(num).toBeLessThanOrEqual(9);
    });
  });

  test('getCandidates returns empty for filled cell', () => {
    const candidates = getCandidates(testBoard, 0, 0);
    expect(candidates).toEqual([]);
  });

  test('getAllCandidates returns object with all empty cells', () => {
    const allCandidates = getAllCandidates(testBoard);
    
    expect(typeof allCandidates).toBe('object');
    
    let emptyCount = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (testBoard[row][col] === 0) {
          emptyCount++;
          expect(allCandidates[`${row}-${col}`]).toBeDefined();
        }
      }
    }
    
    expect(Object.keys(allCandidates).length).toBe(emptyCount);
  });
});
