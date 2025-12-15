import { recordGameCompletion, currentUser } from './firebase.js';

const animate = anime.anime || anime;

const gameState = {
    grid: Array(6).fill(null).map(() => Array(6).fill(0)),
    notes: Array(6).fill(null).map(() => Array(6).fill(null).map(() => new Set())),
    given: Array(6).fill(null).map(() => Array(6).fill(false)),
    regions: Array(6).fill(null).map(() => Array(6).fill(-1)),
    selectedCell: null,
    notesMode: false,
    history: [],
    startTime: null,
    elapsedTime: 0,
    timerInterval: null
};

function generateStandardRegions() {
    const regions = Array(6).fill(null).map(() => Array(6).fill(-1));
    
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            const boxRow = Math.floor(r / 2);
            const boxCol = Math.floor(c / 3);
            regions[r][c] = boxRow * 2 + boxCol;
        }
    }
    
    return regions;
}

const elements = {
    grid: document.getElementById('sudoku-grid'),
    timer: document.getElementById('timer'),
    notesBtn: document.getElementById('notes-btn'),
    notesLabel: document.getElementById('notes-label'),
    undoBtn: document.getElementById('undo-btn'),
    eraseBtn: document.getElementById('erase-btn'),
    hintBtn: document.getElementById('hint-btn'),
    resetBtn: document.getElementById('reset-btn'),
    numberBtns: document.querySelectorAll('.number-btn'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalIcon: document.getElementById('modal-icon'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalBtn: document.getElementById('modal-btn')
};

function showModal(icon, title, message) {
    elements.modalIcon.textContent = icon;
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modalOverlay.classList.add('active');
    
    animate(elements.modalOverlay, {
        opacity: [0, 1],
        duration: 200
    });
    
    animate('.modal-content', {
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutBack'
    });
}

function hideModal() {
    animate('.modal-content', {
        scale: [1, 0.9],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuad',
        complete: () => {
            elements.modalOverlay.classList.remove('active');
        }
    });
}

elements.modalBtn.addEventListener('click', hideModal);
elements.modalOverlay.addEventListener('click', (e) => {
    if (e.target === elements.modalOverlay) {
        hideModal();
    }
});

function initGrid() {
    gameState.regions = generateStandardRegions();
    elements.grid.innerHTML = '';
    
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.dataset.region = gameState.regions[row][col];
            
            applyRegionBorders(cell, row, col);
            
            cell.addEventListener('click', () => selectCell(row, col));
            elements.grid.appendChild(cell);
        }
    }
    
    renderGrid();
}

function applyRegionBorders(cell, row, col) {
    const currentRegion = gameState.regions[row][col];
    
    if (row === 0 || gameState.regions[row - 1][col] !== currentRegion) {
        cell.style.borderTopWidth = '3px';
        cell.style.borderTopColor = '#5d4f4a';
    }
    if (row === 5 || gameState.regions[row + 1][col] !== currentRegion) {
        cell.style.borderBottomWidth = '3px';
        cell.style.borderBottomColor = '#5d4f4a';
    }
    if (col === 0 || gameState.regions[row][col - 1] !== currentRegion) {
        cell.style.borderLeftWidth = '3px';
        cell.style.borderLeftColor = '#5d4f4a';
    }
    if (col === 5 || gameState.regions[row][col + 1] !== currentRegion) {
        cell.style.borderRightWidth = '3px';
        cell.style.borderRightColor = '#5d4f4a';
    }
}

function selectCell(row, col) {
    const prevSelected = gameState.selectedCell;
    gameState.selectedCell = { row, col };
    
    clearHighlights();
    highlightCell(row, col);
    highlightRowCol(row, col);
    highlightRegion(row, col);
    
    const currentValue = gameState.grid[row][col];
    if (currentValue > 0) {
        highlightSameNumbers(currentValue);
    }
    
    const cell = getCellElement(row, col);
    cell.classList.add('selected');
    
    animate(cell, {
        scale: [0.95, 1],
        duration: 200,
        easing: 'easeOutQuad'
    });
}

function getCellElement(row, col) {
    return elements.grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function clearHighlights() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('selected', 'highlighted');
        cell.style.backgroundColor = '';
        cell.style.borderColor = '';
    });
}

function highlightCell(row, col) {
    const cell = getCellElement(row, col);
    cell.classList.add('selected');
}

function highlightRowCol(row, col) {
    for (let i = 0; i < 6; i++) {
        if (i !== col) {
            getCellElement(row, i).classList.add('highlighted');
        }
        if (i !== row) {
            getCellElement(i, col).classList.add('highlighted');
        }
    }
}

function highlightRegion(row, col) {
    const region = gameState.regions[row][col];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (gameState.regions[r][c] === region && !(r === row && c === col)) {
                getCellElement(r, c).classList.add('highlighted');
            }
        }
    }
}

function highlightSameNumbers(num) {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (gameState.grid[r][c] === num) {
                const cell = getCellElement(r, c);
                cell.style.backgroundColor = '#3d3520';
                cell.style.color = '#f4d58d';
            }
        }
    }
}

function renderGrid() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const cell = getCellElement(row, col);
            const value = gameState.grid[row][col];
            const notes = gameState.notes[row][col];
            
            cell.innerHTML = '';
            
            if (value > 0) {
                cell.textContent = value;
                cell.classList.remove('notes-mode');
                if (gameState.given[row][col]) {
                    cell.classList.add('given');
                    cell.classList.remove('user-filled');
                } else {
                    cell.classList.add('user-filled');
                    cell.classList.remove('given');
                }
            } else if (notes.size > 0) {
                cell.classList.add('notes-mode');
                const notesContainer = document.createElement('div');
                notesContainer.className = 'cell-notes';
                
                for (let i = 1; i <= 6; i++) {
                    const noteDiv = document.createElement('div');
                    noteDiv.className = 'note';
                    if (notes.has(i)) {
                        noteDiv.textContent = i;
                    }
                    notesContainer.appendChild(noteDiv);
                }
                
                cell.appendChild(notesContainer);
            } else {
                cell.classList.remove('notes-mode', 'given', 'user-filled');
            }
        }
    }
}

function isValid(grid, row, col, num) {
    for (let i = 0; i < 6; i++) {
        if (i !== col && grid[row][i] === num) return false;
        if (i !== row && grid[i][col] === num) return false;
    }
    
    const region = gameState.regions[row][col];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (gameState.regions[r][c] === region && !(r === row && c === col) && grid[r][c] === num) {
                return false;
            }
        }
    }
    
    return true;
}

function handleNumberInput(num) {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
    if (gameState.given[row][col]) return;
    
    saveHistory();
    
    if (gameState.notesMode) {
        const notes = gameState.notes[row][col];
        if (notes.has(num)) {
            notes.delete(num);
        } else {
            notes.add(num);
        }
    } else {
        gameState.grid[row][col] = num;
        gameState.notes[row][col].clear();
        
        if (!isValid(gameState.grid, row, col, num)) {
            animateError(row, col);
        }
    }
    
    renderGrid();
    animateNumberEntry(row, col);
    checkVictory();
}

function animateNumberEntry(row, col) {
    const cell = getCellElement(row, col);
    animate(cell, {
        scale: [1.2, 1],
        duration: 300,
        easing: 'easeOutElastic(1, 0.6)'
    });
}

function animateError(row, col) {
    const cell = getCellElement(row, col);
    cell.style.color = '#e74c3c';
    
    animate(cell, {
        translateX: [
            { value: -10, duration: 50 },
            { value: 10, duration: 50 },
            { value: -10, duration: 50 },
            { value: 10, duration: 50 },
            { value: 0, duration: 50 }
        ],
        easing: 'linear'
    });
    
    setTimeout(() => {
        cell.style.color = '';
    }, 1000);
}

async function checkVictory() {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (gameState.grid[row][col] === 0) return;
        }
    }
    
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            const num = gameState.grid[row][col];
            if (!isValid(gameState.grid, row, col, num)) {
                return;
            }
        }
    }
    
    clearInterval(gameState.timerInterval);
    
    const timeInSeconds = Math.floor(gameState.elapsedTime / 1000);
    if (currentUser) {
        await recordGameCompletion(currentUser.uid, timeInSeconds);
    }
    
    celebrateVictory();
}

function celebrateVictory() {
    const cells = document.querySelectorAll('.cell');
    
    animate(cells, {
        scale: [
            { value: 1.1, duration: 200 },
            { value: 1, duration: 200 }
        ],
        backgroundColor: [
            { value: '#3d4d3a', duration: 300 },
            { value: '#2d1f1a', duration: 300 }
        ],
        delay: anime.stagger(30, { grid: [6, 6], from: 'center' }),
        easing: 'easeOutQuad'
    });
    
    setTimeout(() => {
        showModal('🎉', 'Congratulations!', `You solved the puzzle in ${elements.timer.textContent}!`);
    }, 1000);
}

function toggleNotesMode() {
    gameState.notesMode = !gameState.notesMode;
    elements.notesLabel.textContent = `Notes: ${gameState.notesMode ? 'ON' : 'OFF'}`;
    elements.notesBtn.classList.toggle('active', gameState.notesMode);
    
    animate(elements.notesBtn, {
        scale: [0.95, 1],
        duration: 200
    });
}

function eraseCell() {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
    if (gameState.given[row][col]) return;
    
    saveHistory();
    gameState.grid[row][col] = 0;
    gameState.notes[row][col].clear();
    renderGrid();
}

function saveHistory() {
    gameState.history.push({
        grid: gameState.grid.map(row => [...row]),
        notes: gameState.notes.map(row => row.map(notes => new Set(notes)))
    });
    
    if (gameState.history.length > 50) {
        gameState.history.shift();
    }
}

function undo() {
    if (gameState.history.length === 0) return;
    
    const prev = gameState.history.pop();
    gameState.grid = prev.grid;
    gameState.notes = prev.notes;
    renderGrid();
    
    animate(elements.undoBtn, {
        rotate: [-15, 0],
        duration: 300
    });
}

function startTimer() {
    gameState.startTime = Date.now() - gameState.elapsedTime;
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    gameState.elapsedTime = Date.now() - gameState.startTime;
    const seconds = Math.floor(gameState.elapsedTime / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    elements.timer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function cellToIndex(row, col) {
    return row * 6 + col;
}

function indexToCell(index) {
    return { row: Math.floor(index / 6), col: index % 6 };
}

function isPossibleRow(number, row, sudoku) {
    for (let i = 0; i < 6; i++) {
        if (sudoku[row * 6 + i] === number) return false;
    }
    return true;
}

function isPossibleCol(number, col, sudoku) {
    for (let i = 0; i < 6; i++) {
        if (sudoku[col + 6 * i] === number) return false;
    }
    return true;
}

function isPossibleRegion(number, cell, sudoku) {
    const { row, col } = indexToCell(cell);
    const region = gameState.regions[row][col];
    
    for (let i = 0; i < 36; i++) {
        const { row: r, col: c } = indexToCell(i);
        if (gameState.regions[r][c] === region && sudoku[i] === number) {
            return false;
        }
    }
    return true;
}

function isPossibleNumber(cell, number, sudoku) {
    const { row, col } = indexToCell(cell);
    return isPossibleRow(number, row, sudoku) && 
           isPossibleCol(number, col, sudoku) && 
           isPossibleRegion(number, cell, sudoku);
}

function determinePossibleValues(cell, sudoku) {
    const possible = [];
    for (let i = 1; i <= 6; i++) {
        if (isPossibleNumber(cell, i, sudoku)) {
            possible.push(i);
        }
    }
    return possible;
}

function scanSudokuForUnique(sudoku) {
    const possible = [];
    for (let i = 0; i < 36; i++) {
        if (sudoku[i] === 0) {
            possible[i] = determinePossibleValues(i, sudoku);
            if (possible[i].length === 0) return false;
        }
    }
    return possible;
}

function nextRandom(possible) {
    let max = 6;
    let minChoices = 0;
    for (let i = 0; i < 36; i++) {
        if (possible[i] && possible[i].length <= max && possible[i].length > 0) {
            max = possible[i].length;
            minChoices = i;
        }
    }
    return minChoices;
}

function determineRandomPossibleValue(possible, cell) {
    const randomPicked = Math.floor(Math.random() * possible[cell].length);
    return possible[cell][randomPicked];
}

function removeAttempt(attemptArray, number) {
    return attemptArray.filter(n => n !== number);
}

function isSolvedSudoku(sudoku) {
    for (let i = 0; i < 36; i++) {
        if (sudoku[i] === 0) return false;
    }
    return true;
}

function solveSudoku(sudoku) {
    const saved = [];
    const savedSudoku = [];
    let iterations = 0;
    const maxIterations = 10000;
    
    while (!isSolvedSudoku(sudoku) && iterations < maxIterations) {
        iterations++;
        let nextMove = scanSudokuForUnique(sudoku);
        
        if (nextMove === false) {
            if (saved.length === 0) return false;
            nextMove = saved.pop();
            sudoku = savedSudoku.pop();
        }
        
        const whatToTry = nextRandom(nextMove);
        const attempt = determineRandomPossibleValue(nextMove, whatToTry);
        
        if (nextMove[whatToTry].length > 1) {
            nextMove[whatToTry] = removeAttempt(nextMove[whatToTry], attempt);
            saved.push([...nextMove]);
            savedSudoku.push([...sudoku]);
        }
        
        sudoku[whatToTry] = attempt;
    }
    
    return isSolvedSudoku(sudoku);
}

const validPuzzles = [
    {
        puzzle: [[0,2,0,0,0,6],[0,0,6,0,2,0],[2,0,0,0,0,1],[5,0,0,0,0,4],[0,4,0,6,0,0],[0,0,2,0,4,0]]
    },
    {
        puzzle: [[1,0,3,0,0,0],[0,5,0,1,0,0],[0,0,0,5,6,0],[0,0,1,0,0,4],[0,0,5,0,1,0],[0,0,0,3,0,5]]
    },
    {
        puzzle: [[0,0,3,4,0,0],[4,0,0,0,2,0],[0,3,0,0,0,1],[0,0,1,0,3,0],[0,2,0,0,0,4],[0,0,4,3,0,0]]
    }
];

function generatePuzzle() {
    const template = validPuzzles[Math.floor(Math.random() * validPuzzles.length)];
    const grid = template.puzzle.map(row => [...row]);
    const given = Array(6).fill(null).map(() => Array(6).fill(false));
    
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (grid[r][c] !== 0) {
                given[r][c] = true;
            }
        }
    }
    
    return { grid, given };
}

function newGame() {
    initGrid();
    const puzzle = generatePuzzle();
    gameState.grid = puzzle.grid.map(row => [...row]);
    gameState.given = puzzle.given.map(row => [...row]);
    gameState.notes = Array(6).fill(null).map(() => Array(6).fill(null).map(() => new Set()));
    gameState.history = [];
    gameState.selectedCell = null;
    gameState.elapsedTime = 0;
    clearInterval(gameState.timerInterval);
    elements.timer.textContent = '00:00';
    renderGrid();
    clearHighlights();
    startTimer();
    
    animate('.cell', {
        scale: [0, 1],
        duration: 400,
        delay: anime.stagger(20, { grid: [6, 6], from: 'center' }),
        easing: 'easeOutElastic(1, 0.6)'
    });
}

function resetGame() {
    gameState.grid = gameState.grid.map((row, r) => 
        row.map((val, c) => gameState.given[r][c] ? val : 0)
    );
    gameState.notes = Array(6).fill(null).map(() => Array(6).fill(null).map(() => new Set()));
    gameState.history = [];
    gameState.selectedCell = null;
    gameState.elapsedTime = 0;
    clearInterval(gameState.timerInterval);
    elements.timer.textContent = '00:00';
    renderGrid();
    clearHighlights();
    startTimer();
}

elements.numberBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const num = parseInt(btn.dataset.number);
        handleNumberInput(num);
        
        animate(btn, {
            scale: [0.9, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });
    });
});

elements.notesBtn.addEventListener('click', toggleNotesMode);
elements.eraseBtn.addEventListener('click', eraseCell);
elements.undoBtn.addEventListener('click', undo);
elements.resetBtn.addEventListener('click', resetGame);


elements.hintBtn.addEventListener('click', provideHint);

const solveBtn = document.getElementById('solve-btn');
solveBtn.addEventListener('click', solvePuzzle);

function solveGrid(grid) {
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (grid[row][col] === 0) {
                for (let num = 1; num <= 6; num++) {
                    if (isValid(grid, row, col, num)) {
                        grid[row][col] = num;
                        if (solveGrid(grid)) {
                            return true;
                        }
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solvePuzzle() {
    const hasEmpty = gameState.grid.some(row => row.includes(0));
    if (!hasEmpty) {
        showModal('✅', 'Already Solved', 'The puzzle is already complete!');
        return;
    }
    
    const gridCopy = gameState.grid.map(row => [...row]);
    
    const canSolve = solveGrid(gridCopy);
    
    if (!canSolve) {
        showModal('❌', 'Unsolvable', 'The current puzzle state is unsolvable. Check for conflicts in your entries.');
        return;
    }
    
    clearInterval(gameState.timerInterval);
    animateSolution(gridCopy);
}

function animateSolution(solvedGrid) {
    const cellsToFill = [];
    
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 6; col++) {
            if (gameState.grid[row][col] === 0) {
                cellsToFill.push({ row, col, value: solvedGrid[row][col] });
            }
        }
    }
    
    let index = 0;
    const interval = setInterval(() => {
        if (index >= cellsToFill.length) {
            clearInterval(interval);
            showModal('✨', 'Solved!', 'The puzzle has been solved automatically.');
            return;
        }
        
        const { row, col, value } = cellsToFill[index];
        gameState.grid[row][col] = value;
        renderGrid();
        
        const cell = getCellElement(row, col);
        animate(cell, {
            scale: [1.3, 1],
            duration: 200,
            easing: 'easeOutQuad'
        });
        
        index++;
    }, 50);
}

function provideHint() {
    if (!gameState.selectedCell) {
        showModal('💡', 'Hint', 'Please select a cell first!');
        return;
    }
    
    const { row, col } = gameState.selectedCell;
    
    if (gameState.given[row][col] || gameState.grid[row][col] !== 0) {
        showModal('💡', 'Hint', 'This cell is already filled!');
        return;
    }
    
    const candidates = [];
    for (let num = 1; num <= 6; num++) {
        if (isValid(gameState.grid, row, col, num)) {
            candidates.push(num);
        }
    }
    
    if (candidates.length === 0) {
        showModal('⚠️', 'Hint', 'No valid numbers for this cell. Check your previous entries!');
        return;
    }
    
    if (candidates.length === 1) {
        const num = candidates[0];
        highlightHintCells(row, col);
        
        setTimeout(() => {
            showModal('💡', 'Hint', `The only number that fits here is ${num}.\n\nThe intersecting row, column, and region eliminate all other possibilities (1-6), leaving only ${num} as valid.`);
            
            elements.modalBtn.onclick = () => {
                hideModal();
                clearHighlights();
                if (gameState.selectedCell) {
                    selectCell(gameState.selectedCell.row, gameState.selectedCell.col);
                }
                elements.modalBtn.onclick = hideModal;
            };
        }, 500);
    } else {
        showModal('💡', 'Hint', `This cell can be ${candidates.join(', ')}.\n\nTry to eliminate candidates by looking at the row, column, and region constraints.`);
    }
    
    animate(elements.hintBtn, {
        scale: [0.9, 1],
        rotate: [0, 10, -10, 0],
        duration: 400
    });
}

function highlightHintCells(row, col) {
    clearHighlights();
    
    for (let i = 0; i < 6; i++) {
        if (gameState.grid[row][i] > 0) {
            getCellElement(row, i).style.backgroundColor = '#4d3f3a';
        }
        if (gameState.grid[i][col] > 0) {
            getCellElement(i, col).style.backgroundColor = '#4d3f3a';
        }
    }
    
    const region = gameState.regions[row][col];
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 6; c++) {
            if (gameState.regions[r][c] === region && gameState.grid[r][c] > 0) {
                getCellElement(r, c).style.backgroundColor = '#4d3f3a';
            }
        }
    }
    
    getCellElement(row, col).style.backgroundColor = '#3d4d3a';
    getCellElement(row, col).style.borderColor = '#6b9b6b';
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '6') {
        handleNumberInput(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        eraseCell();
    } else if (e.key === 'n' || e.key === 'N') {
        toggleNotesMode();
    }
});

newGame();
