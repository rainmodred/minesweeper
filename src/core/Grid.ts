import Cell from './Cell';
import { getRandomInt } from './utils';

export default class Grid {
  matrix: Cell[][];

  height: number;

  width: number;

  minesQuantity: number;

  constructor(
    height: number,
    width: number,
    minesQuantity: number) {

    this.matrix = [];
    this.height = height;
    this.width = width;
    this.minesQuantity = minesQuantity;

    this.createGrid(height, width, minesQuantity);
  }

  private getEmptyCells() {
    const emptyCells = [];

    for (const row of this.matrix) {
      for (const cell of row) {
        if (!cell.hasMine) {
          emptyCells.push(cell);
        }
      }
    }

    return emptyCells;
  }

  createGrid(height: number, width: number, minesQuantity: number) {
    let id = 0;

    const arr = new Array(width);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(height);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Cell(id, i, j, false, false, false, 0);
        id++;
      }
    }
    this.matrix = arr;
    this.addMines(minesQuantity);
  }

  getCell(row: number, col: number) {
    if (row < this.height && col < this.width) {
      return this.matrix[row][col];
    }
  }

  private addMines(minesQuantity: number) {
    const emptyCells = this.getEmptyCells();

    const randomCells: number[] = [];

    while (randomCells.length < minesQuantity) {
      const randomIndex = getRandomInt(0, emptyCells.length);
      if (!randomCells.includes(randomIndex)) {
        randomCells.push(randomIndex);
      }
    }

    randomCells.forEach((i) => {
      const { row, col } = emptyCells[i];
      this.matrix[row][col].setMine();
    });

    this.addCellCaption();
  }

  private addCellCaption() {
    return this.matrix.map(row => {
      return row.map(cell => {
        if (!cell.hasMine) {
          cell.setMinesAround(this.findMinesAround(cell.row, cell.col));
        }
        return cell;
      });
    });
  }

  private findMinesAround(row: number, col: number): number {
    let minesAround = 0;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < this.matrix.length && j >= 0 && j < this.matrix[0].length) {
          if (this.matrix[i][j].hasMine) {
            minesAround++;
          }
        }
      }
    }

    return minesAround;
  }

  // todo
  // private floodFill(cell: Cell) {
  //   const que = [];
  //   const height = grid.length;
  //   const width = grid[0].length;

  //   cell.isOpened = true;
  //   let openedCells = 0;

  //   que.push(cell);
  //   while (que.length !== 0) {
  //     const { row, col } = que.shift();
  //     openedCells++;
  //     // WEST
  //     if (col - 1 >= 0 && col < width) {
  //       if (grid[row][col - 1].neighbourMineCount === 0) {
  //         if (grid[row][col - 1].isOpened === false && grid[row][col - 1].hasFlag === false) {
  //           grid[row][col - 1].isOpened = true;
  //           que.push(grid[row][col - 1]);
  //         }
  //       } else if (grid[row][col - 1].isOpened === false) {
  //         grid[row][col - 1].isOpened = true;
  //         openedCells++;
  //       }
  //     }
  //     // EAST
  //     if (col >= 0 && col + 1 < width) {
  //       if (grid[row][col + 1].neighbourMineCount === 0) {
  //         if (grid[row][col + 1].isOpened === false && grid[row][col + 1].hasFlag === false) {
  //           grid[row][col + 1].isOpened = true;
  //           que.push(grid[row][col + 1]);
  //         }
  //       } else if (grid[row][col + 1].isOpened === false) {
  //         grid[row][col + 1].isOpened = true;
  //         openedCells++;
  //       }
  //     }
  //     // NORTH
  //     if (row - 1 >= 0 && row < height) {
  //       if (grid[row - 1][col].neighbourMineCount === 0) {
  //         if (grid[row - 1][col].isOpened === false && grid[row - 1][col].hasFlag === false) {
  //           grid[row - 1][col].isOpened = true;
  //           que.push(grid[row - 1][col]);
  //         }
  //       } else if (grid[row - 1][col].isOpened === false) {
  //         grid[row - 1][col].isOpened = true;
  //         openedCells++;
  //       }
  //     }
  //     // SOUTH
  //     if (row >= 0 && row + 1 < height) {
  //       if (grid[row + 1][col].neighbourMineCount === 0) {
  //         if (grid[row + 1][col].isOpened === false && grid[row + 1][col].hasFlag === false) {
  //           grid[row + 1][col].isOpened = true;
  //           que.push(grid[row + 1][col]);
  //         }
  //       } else if (grid[row + 1][col].isOpened === false) {
  //         grid[row + 1][col].isOpened = true;
  //         openedCells++;
  //       }
  //     }
  //   }
  //   return { grid, openedCells };
  // }
}

