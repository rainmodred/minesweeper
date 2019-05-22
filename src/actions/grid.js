export const CREATE_GRID = 'CREATE_GRID';
export const OPEN_ONE_CELL = 'OPEN_ONE_CELL';
export const OPEN_MULTIPLE_CELLS = 'OPEN_MULTIPLE_CELLS';
export const REVEAL_MINES = 'REVEAL_MINES';
export const TOGGLE_FLAG = 'TOGGLE_FLAG';
export const START_TIMER = 'START_TIMER';
export const RESET_TIMER = 'RESET_TIMER';
export const NEW_GAME = 'NEW_GAME';

export function createGrid(height, width, minesQuantity) {
  return {
    type: CREATE_GRID,
    payload: { height, width, minesQuantity },
  };
}

export function revealMines() {
  return {
    type: REVEAL_MINES,
  };
}

export function toggleFlag(row, col) {
  return {
    type: TOGGLE_FLAG,
    payload: { row, col },
  };
}

export function newGame() {
  return {};
}
//todo: fix star timer calls
export function openOneCell(row, col) {
  return {
    type: OPEN_ONE_CELL,
    payload: { row, col },
  };
}

export function openMultipleCells(cell) {
  return {
    type: OPEN_MULTIPLE_CELLS,
    payload: { cell },
  };
}
