export const CREATE_GRID = 'CREATE_GRID';

export const createGrid = (height, width, minesQuantity) => {
  return {
    type: CREATE_GRID,
    payload: { height, width, minesQuantity },
  };
};
