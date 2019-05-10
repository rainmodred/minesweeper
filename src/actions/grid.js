export const CREATE_GRID = 'CREATE_GRID';
export const OPEN_CELL = 'OPEN_CELL';

export const createGrid = (height, width, minesQuantity) => {
  return {
    type: CREATE_GRID,
    payload: { height, width, minesQuantity },
  };
};

export const openCell = (row, col) => {
  return {
    type: OPEN_CELL,
    payload: { row, col },
  };
};
