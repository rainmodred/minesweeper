import {
  CREATE_GRID,
  OPEN_ONE_CELL,
  OPEN_MULTIPLE_CELLS,
  TOGGLE_FLAG,
  REVEAL_MINES,
} from '../actions/grid';
import Cell from '../components/Cell/Cell';

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

  if (cell.isOpened || cell.hasFlag) {
    return grid;
  }

  if (cell.hasMine) {
    cell.isOpened = true;
    //gameover
    return grid.map(row =>
      row.map(cell => {
        if (cell.hasMine && !cell.isOpened) {
          cell.isOpened = true;
        }
        return cell;
      })
    );
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

    return grid;
  }
}

//queue flood fill
function floodFill(grid, cell) {
  const que = [];
  const height = grid.length;
  const width = grid[0].length;

  cell.isOpened = true;
  let openedCells = 0;

  que.push(cell);
  while (que.length !== 0) {
    let { row, col } = que.shift();
    openedCells++;
    //WEST
    if (col - 1 >= 0 && col < width) {
      if (grid[row][col - 1].neighbourMineCount === 0) {
        if (grid[row][col - 1].isOpened === false && grid[row][col - 1].hasFlag === false) {
          grid[row][col - 1].isOpened = true;
          que.push(grid[row][col - 1]);
          // openedCells++;
        }
      } else {
        if (grid[row][col - 1].isOpened === false) {
          grid[row][col - 1].isOpened = true;
          openedCells++;
        }
      }
    }
    //EAST
    if (col >= 0 && col + 1 < width) {
      if (grid[row][col + 1].neighbourMineCount === 0) {
        if (grid[row][col + 1].isOpened === false && grid[row][col + 1].hasFlag === false) {
          grid[row][col + 1].isOpened = true;
          que.push(grid[row][col + 1]);
          // openedCells++;
        }
      } else {
        if (grid[row][col + 1].isOpened === false) {
          grid[row][col + 1].isOpened = true;
          openedCells++;
        }
      }
    }
    //NORTH
    if (row - 1 >= 0 && row < height) {
      if (grid[row - 1][col].neighbourMineCount === 0) {
        if (grid[row - 1][col].isOpened === false && grid[row - 1][col].hasFlag === false) {
          grid[row - 1][col].isOpened = true;
          que.push(grid[row - 1][col]);
          // openedCells++;
        }
      } else {
        if (grid[row - 1][col].isOpened === false) {
          grid[row - 1][col].isOpened = true;
          openedCells++;
        }
      }
    }
    //SOUTH
    if (row >= 0 && row + 1 < height) {
      if (grid[row + 1][col].neighbourMineCount === 0) {
        if (grid[row + 1][col].isOpened === false && grid[row + 1][col].hasFlag === false) {
          grid[row + 1][col].isOpened = true;
          que.push(grid[row + 1][col]);
          // openedCells++;
        }
      } else {
        if (grid[row + 1][col].isOpened === false) {
          grid[row + 1][col].isOpened = true;
          openedCells++;
        }
      }
    }
  }
  return { grid, openedCells };
}

const initialState = {
  grid: [],
  height: 9,
  width: 9,
  openedCells: 0,
};

function copy2dArray(array) {
  return array.map(row => [...row]);
}

function revealMines(grid) {
  //gameover
  return grid.map(row =>
    row.map(cell => {
      if (cell.hasMine && !cell.isOpened) {
        cell.isOpened = true;
      }
      return cell;
    })
  );
}

const gridReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_GRID:
      const { height, width, minesQuantity } = action.payload;

      return { ...state, grid: createGrid(height, width, minesQuantity), openedCells: 0 };
    case OPEN_ONE_CELL:
      return {
        ...state,
        openedCells: state.openedCells + 1,
        grid: state.grid.map(row =>
          row.map(cell => {
            if (cell.row === action.payload.row && cell.col === action.payload.col) {
              cell.isOpened = true;
            }
            return cell;
          })
        ),
      };
    case OPEN_MULTIPLE_CELLS:
      const { grid, openedCells } = floodFill(state.grid, action.payload.cell);
      const openedCellsCount = grid.map(row => row.filter(cell => cell.isOpened));
      console.log(openedCellsCount);
      return { ...state, grid: grid, openedCells: state.openedCells + openedCells };
    case REVEAL_MINES:
      return { ...state, grid: revealMines(copy2dArray(state.grid)) };
    case TOGGLE_FLAG:
      let flagsLeft = state.flagsLeft;
      let changedGrid = state.grid.map(row =>
        row.map(cell => {
          if (cell.row === action.payload.row && cell.col === action.payload.col) {
            if (!cell.hasFlag) flagsLeft--;
            return {
              ...cell,
              hasFlag: !cell.hasFlag,
            };
          }
          return cell;
        })
      );
      return {
        ...state,
        grid: changedGrid,
        flagsLeft: flagsLeft,
      };
    default:
      return state;
  }
};

export default gridReducer;
