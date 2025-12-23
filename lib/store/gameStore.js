'use client';

import { create } from 'zustand';
import { generatePuzzle } from '../sudoku/generator';
import { solve, getHint, getCandidates, getAllCandidates } from '../sudoku/solver';
import { hasConflict, isBoardComplete, isBoardValid } from '../sudoku/validator';
import { playSound } from '../sounds';

export const useGameStore = create((set, get) => ({
  puzzle: null,
  solution: null,
  board: null,
  initialBoard: null,
  difficulty: 'medium',
  selectedCell: null,
  selectedNumber: null,
  mode: 'normal',
  candidates: {},
  history: [],
  historyIndex: -1,
  timer: 0,
  timerRunning: false,
  errors: 0,
  hintsUsed: 0,
  gameStarted: false,
  gameCompleted: false,
  solvedManually: true,
  hintCell: null,
  settings: {
    timerEnabled: true,
    errorCounterEnabled: true,
    checkOnEntry: true,
    highlightRow: true,
    highlightColumn: true,
    highlightBox: true,
    highlightIdentical: true,
    soundEnabled: false,
  },

  startNewGame: (difficulty) => {
    const { puzzle, solution } = generatePuzzle(difficulty);
    const board = puzzle.map(row => [...row]);
    
    set({
      puzzle,
      solution,
      board,
      initialBoard: puzzle.map(row => [...row]),
      difficulty,
      selectedCell: null,
      selectedNumber: null,
      candidates: {},
      history: [],
      historyIndex: -1,
      timer: 0,
      timerRunning: true,
      errors: 0,
      hintsUsed: 0,
      gameStarted: true,
      gameCompleted: false,
    });
  },

  selectCell: (row, col) => {
    const { board } = get();
    if (!board) return;
    
    set({ selectedCell: { row, col } });
  },

  selectNumber: (num) => {
    set({ selectedNumber: num });
  },

  setMode: (mode) => {
    set({ mode });
  },

  placeNumber: (row, col, num) => {
    const { board, initialBoard, mode, candidates, settings, errors } = get();
    
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    const newCandidates = { ...candidates };
    const key = `${row}-${col}`;

    if (mode === 'normal') {
      const oldValue = newBoard[row][col];
      newBoard[row][col] = num;

      if (num !== 0 && settings.checkOnEntry && hasConflict(newBoard, row, col, num)) {
        set({ errors: errors + 1, timer: get().timer + 30 });
        if (settings.soundEnabled) playSound('error');
      } else if (num !== 0 && settings.soundEnabled) {
        playSound('place');
      }

      delete newCandidates[key];

      get().addToHistory({ type: 'place', row, col, oldValue, newValue: num });
    } else {
      if (!newCandidates[key]) {
        newCandidates[key] = [];
      }

      const candidateList = [...newCandidates[key]];
      const index = candidateList.indexOf(num);

      if (index > -1) {
        candidateList.splice(index, 1);
      } else {
        candidateList.push(num);
        candidateList.sort();
      }

      newCandidates[key] = candidateList;

      get().addToHistory({ type: 'candidate', row, col, oldValue: candidates[key] || [], newValue: candidateList });
    }

    set({ board: newBoard, candidates: newCandidates });

    if (isBoardComplete(newBoard) && isBoardValid(newBoard)) {
      set({ gameCompleted: true, timerRunning: false, solvedManually: true });
      if (settings.soundEnabled) playSound('complete');
    }
  },

  clearCell: (row, col) => {
    const { board, initialBoard, candidates } = get();
    
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map(r => [...r]);
    const newCandidates = { ...candidates };
    const key = `${row}-${col}`;

    const oldValue = newBoard[row][col];
    newBoard[row][col] = 0;
    delete newCandidates[key];

    get().addToHistory({ type: 'clear', row, col, oldValue });

    set({ board: newBoard, candidates: newCandidates });
  },

  useHint: () => {
    const { board, solution, hintsUsed } = get();
    const hint = getHint(board, solution);

    if (hint) {
      const { settings } = get();
      if (settings.soundEnabled) playSound('hint');
      get().placeNumber(hint.row, hint.col, hint.value);
      set({ hintsUsed: hintsUsed + 1, hintCell: { row: hint.row, col: hint.col } });
      
      setTimeout(() => {
        set({ hintCell: null });
      }, 2000);
    }
  },

  autoFillCandidates: () => {
    const { board } = get();
    const allCandidates = getAllCandidates(board);
    set({ candidates: allCandidates });
  },

  solvePuzzle: () => {
    const { board } = get();
    const solution = solve(board);
    set({ board: solution, timerRunning: false, gameCompleted: true, solvedManually: false });
  },

  addToHistory: (action) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, board, candidates } = get();
    
    if (historyIndex < 0) return;

    const action = history[historyIndex];
    const newBoard = board.map(r => [...r]);
    const newCandidates = { ...candidates };
    const key = `${action.row}-${action.col}`;

    if (action.type === 'place' || action.type === 'clear') {
      newBoard[action.row][action.col] = action.oldValue;
    } else if (action.type === 'candidate') {
      newCandidates[key] = action.oldValue;
    }

    set({ board: newBoard, candidates: newCandidates, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex, board, candidates } = get();
    
    if (historyIndex >= history.length - 1) return;

    const action = history[historyIndex + 1];
    const newBoard = board.map(r => [...r]);
    const newCandidates = { ...candidates };
    const key = `${action.row}-${action.col}`;

    if (action.type === 'place') {
      newBoard[action.row][action.col] = action.newValue;
    } else if (action.type === 'clear') {
      newBoard[action.row][action.col] = 0;
    } else if (action.type === 'candidate') {
      newCandidates[key] = action.newValue;
    }

    set({ board: newBoard, candidates: newCandidates, historyIndex: historyIndex + 1 });
  },

  toggleTimer: () => {
    set({ timerRunning: !get().timerRunning });
  },

  incrementTimer: () => {
    const { timerRunning } = get();
    if (timerRunning) {
      set({ timer: get().timer + 1 });
    }
  },

  updateSettings: (newSettings) => {
    set({ settings: { ...get().settings, ...newSettings } });
  },

  resetGame: () => {
    set({
      puzzle: null,
      solution: null,
      board: null,
      initialBoard: null,
      selectedCell: null,
      selectedNumber: null,
      candidates: {},
      history: [],
      historyIndex: -1,
      timer: 0,
      timerRunning: false,
      errors: 0,
      hintsUsed: 0,
      gameStarted: false,
      gameCompleted: false,
      solvedManually: true,
      hintCell: null,
    });
  }
}));
