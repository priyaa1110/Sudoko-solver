import { hasConflict, isValidMove, isBoardComplete, isBoardValid, getConflicts } from '../validator';

describe('Sudoku Validator', () => {
  const validBoard = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
  ];

  const incompleteBoard = [
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

  const conflictBoard = [
    [5,5,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
  ];

  test('hasConflict detects row conflict', () => {
    expect(hasConflict(conflictBoard, 0, 1, 5)).toBe(true);
  });

  test('hasConflict detects column conflict', () => {
    const board = incompleteBoard.map(row => [...row]);
    board[0][0] = 6;
    expect(hasConflict(board, 0, 0, 6)).toBe(true);
  });

  test('hasConflict detects box conflict', () => {
    const board = incompleteBoard.map(row => [...row]);
    expect(hasConflict(board, 0, 2, 5)).toBe(true);
  });

  test('hasConflict returns false for valid placement', () => {
    expect(hasConflict(incompleteBoard, 0, 2, 4)).toBe(false);
  });

  test('hasConflict returns false for zero', () => {
    expect(hasConflict(incompleteBoard, 0, 2, 0)).toBe(false);
  });

  test('isValidMove returns true for valid move', () => {
    expect(isValidMove(incompleteBoard, 0, 2, 4)).toBe(true);
  });

  test('isValidMove returns false for invalid move', () => {
    expect(isValidMove(incompleteBoard, 0, 2, 5)).toBe(false);
  });

  test('isBoardComplete returns true for complete board', () => {
    expect(isBoardComplete(validBoard)).toBe(true);
  });

  test('isBoardComplete returns false for incomplete board', () => {
    expect(isBoardComplete(incompleteBoard)).toBe(false);
  });

  test('isBoardValid returns true for valid board', () => {
    expect(isBoardValid(validBoard)).toBe(true);
  });

  test('isBoardValid returns false for board with conflicts', () => {
    expect(isBoardValid(conflictBoard)).toBe(false);
  });

  test('getConflicts returns empty set for valid board', () => {
    const conflicts = getConflicts(validBoard);
    expect(conflicts.size).toBe(0);
  });

  test('getConflicts identifies conflicting cells', () => {
    const conflicts = getConflicts(conflictBoard);
    expect(conflicts.size).toBeGreaterThan(0);
    expect(conflicts.has('0-0') || conflicts.has('0-1')).toBe(true);
  });
});
