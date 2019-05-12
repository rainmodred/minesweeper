import { CREATE_GRID, OPEN_CELL } from '../actions/grid';

//need refactor
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
        isOpened: false,
        hasMine: false,
        hasFlag: false,
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

function openCell(grid, row, col) {
  let cell = grid[row][col];
  console.log(cell);
  //debugger;

  if (cell.isOpened) {
    return grid;
  }

  if (cell.hasMine) {
    cell.isOpened = true;
    //gameover
    return grid;
  }

  if (cell.neighbourMineCount > 0) {
    cell.isOpened = true;
    //checkwin
    return grid;
  }

  if (cell.neighbourMineCount === 0) {
    //debugger;
    cell.isOpened = true;
    floodFill(grid, cell);
    console.log(grid);
    return grid;
  }
}

//queue flood fill
function floodFill(grid, cell) {
  const que = [];
  //debugger;
  let { row, col, isOpened } = cell;

  que.push(cell);
  while (que.length !== 0) {
    let n = que.shift();
    //let pos = this.getIndex(n);
    //console.log(que.length);
    if (n.col - 1 >= 0 && n.col - 1 < 9) {
      if (grid[n.row][n.col - 1].neighbourMineCount === 0) {
        if (grid[n.row][n.col - 1].isOpened === false) {
          grid[n.row][n.col - 1].isOpened = true;
          que.push(grid[n.row][n.col - 1]);
        }
      } else {
        grid[n.row][n.col - 1].isOpened = true;
      }
    }
    if (n.col + 1 >= 0 && n.col + 1 < 9) {
      if (grid[n.row][n.col + 1].neighbourMineCount === 0) {
        if (grid[n.row][n.col + 1].isOpened === false) {
          grid[n.row][n.col + 1].isOpened = true;
          que.push(grid[n.row][n.col + 1]);
        }
      } else {
        grid[n.row][n.col + 1].isOpened = true;
      }
    }
    if (n.row - 1 >= 0 && n.row - 1 < 9) {
      if (grid[n.row - 1][n.col].neighbourMineCount === 0) {
        if (grid[n.row - 1][n.col].isOpened === false) {
          grid[n.row - 1][n.col].isOpened = true;
          que.push(grid[n.row - 1][n.col]);
        }
      } else {
        grid[n.row - 1][n.col].isOpened = true;
      }
    }
    if (n.row + 1 >= 0 && n.row + 1 < 9) {
      if (grid[n.row + 1][n.col].neighbourMineCount === 0) {
        if (grid[n.row + 1][n.col].isOpened === false) {
          grid[n.row + 1][n.col].isOpened = true;
          que.push(grid[n.row + 1][n.col]);
        }
      } else {
        grid[n.row + 1][n.col].isOpened = true;
      }
    }
  }
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
      const { height, width, minesQuantity } = action.payload;
      let grid = createGrid(height, width, minesQuantity);

      return { ...state, grid: grid };
    case OPEN_CELL:
      const { row, col } = action.payload;
      let copyGrid = state.grid.map(row => [...row]);
      let newGrid = openCell(copyGrid, row, col);
      console.log(newGrid);
      return { ...state, grid: newGrid };
    default:
      return state;
  }
};

export default gridReducer;
