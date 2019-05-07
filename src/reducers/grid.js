import { CREATE_GRID } from '../actions/grid';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createGrid(height, width, minesQuantity) {
  let grid = [];
  let id = 0;

  for (let row = 0; row < height; row++) {
    grid.push([]);
    for (let col = 0; col < width; col++) {
      grid[row].push({
        row: row,
        col: col,
        isOpened: true,
        hasMine: false,
        neighbourMineCount: 0,
        id: id,
      });
      id++;
    }
  }

  grid = addMines(grid, height, width, minesQuantity);

  grid = addNeighbourMineCount(grid);
  return grid;
}

function addMines(grid, height, width, minesQuantity) {
  let minesCount = 0;
  while (minesCount !== minesQuantity) {
    let row = getRandomInt(0, height);
    let col = getRandomInt(0, width);
    if (!grid[row][col].hasMine) {
      grid[row][col].hasMine = true;
      minesCount++;
    }
  }
  return grid;
}

function addNeighbourMineCount(grid) {
  return grid.map(row => {
    return row.map(cell => {
      if (!cell.hasMine) {
        cell.neighbourMineCount = findNeighbourMineCount(grid, cell.row, cell.col);
      }
      return cell;
    });
  });
}

function findNeighbourMineCount(grid, row, col) {
  let neighbourMineCount = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
        if (grid[i][j].hasMine) {
          neighbourMineCount++;
        }
      }
    }
  }

  return neighbourMineCount;
}

const initialState = {
  grid: [],
  minesQuantity: 10,
  height: 9,
  width: 9,
};

const gridReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GRID:
      debugger;
      const { height, width, minesQuantity } = action.payload;
      let grid = createGrid(height, width, minesQuantity);

      return { ...state, grid: grid };
    default:
      return state;
  }
};

export default gridReducer;
