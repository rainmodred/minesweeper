import Cell, { CellState } from './Cell';
import { getRandomInt } from './utils';

export default class Grid {
  matrix: Cell[][];

  height: number;

  width: number;

  minesQuantity: number;

  openedCells: number;

  constructor(
    height: number,
    width: number,
    minesQuantity: number) {

    this.matrix = [];
    this.height = height;
    this.width = width;
    this.minesQuantity = minesQuantity;
    this.openedCells = 0;

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
      this.matrix[row][col].hasMine = true;
    });

    this.setCellsValue();
  }

  private setCellsValue() {
    return this.matrix.map(row => {
      return row.map(cell => {
        if (!cell.hasMine) {
          cell.value = this.findMinesAround(cell.row, cell.col);
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

  print() {
    console.table(this.matrix.map((row) => row.map((cell: Cell) => cell.value)));
  }

  createGrid(height: number, width: number, minesQuantity: number) {
    let id = 0;

    const arr = new Array(height);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(width);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = new Cell(id, i, j);
        id++;
      }
    }
    this.matrix = arr;
    this.addMines(minesQuantity);
  }

  moveMine(row: number, col: number) {
    const emptyCells = this.getEmptyCells();
    const randomCell = emptyCells[getRandomInt(0, emptyCells.length)];

    this.getCell(row, col).hasMine = false;
    this.getCell(randomCell.row, randomCell.col).hasMine = true;
    this.getCell(randomCell.row, randomCell.col).value = 0;

    this.setCellsValue();
  }

  getValue(row: number, col: number) {
    return this.matrix[row][col].value;
  }

  getCell(row: number, col: number) {
    return this.matrix[row][col];
  }

  toggleFlag(row: number, col: number) {
    this.getCell(row, col).toggleFlag();
  }

  openCell(row: number, col: number) {
    const cell = this.getCell(row, col);
    cell.openCell();
  }

  showCell(row: number, col: number) {
    const cell = this.getCell(row, col);

    if (cell.state === CellState.opened || cell.state === CellState.flagged) {
      return null;
    }

    if (cell.hasMine) {
      return !cell.hasMine;
    }

    if (cell.value !== 0) {
      cell.openCell();
      this.openedCells++;
    } else {
      this.floodFill(cell);
    }
    return true;
  }

  reveal() {
    this.matrix.forEach((row) => row.map((cell) => cell.hasMine && cell.openCell()));
  }

  private floodFill(cell: Cell) {
    const que: Cell[] = [];
    const { height } = this;
    const { width } = this;

    cell.openCell();
    que.push(cell);
    while (que.length !== 0) {
      this.openedCells++;
      const { row, col } = que.shift()!;
      // WEST
      if (col - 1 >= 0 && col < width) {
        const currentCell = this.getCell(row, col - 1);
        if (currentCell.value === 0) {
          if (!currentCell.isOpened && !currentCell.isFlagged) {
            currentCell.openCell();
            que.push(currentCell);
          }
        } else if (!currentCell.isOpened) {
          currentCell.openCell();
          this.openedCells++;

        }
      }
      // EAST
      if (col >= 0 && col + 1 < width) {
        const currentCell = this.getCell(row, col + 1);
        if (currentCell.value === 0) {
          if (!currentCell.isOpened && !currentCell.isFlagged) {
            currentCell.openCell();
            que.push(currentCell);
          }
        } else if (!currentCell.isOpened) {
          currentCell.openCell();
          this.openedCells++;

        }
      }
      // NORTH
      if (row - 1 >= 0 && row < height) {
        const currentCell = this.getCell(row - 1, col);
        if (currentCell.value === 0) {
          if (!currentCell.isOpened && !currentCell.isFlagged) {
            currentCell.openCell();
            que.push(currentCell);
          }
        } else if (!currentCell.isOpened) {
          currentCell.openCell();
          this.openedCells++;

        }
      }
      // SOUTH
      if (row >= 0 && row + 1 < height) {
        const currentCell = this.getCell(row + 1, col);
        if (currentCell.value === 0) {
          if (!currentCell.isOpened && !currentCell.isFlagged) {
            currentCell.openCell();
            que.push(currentCell);
          }
        } else if (!currentCell.isOpened) {
          currentCell.openCell();
          this.openedCells++;

        }
      }
    }
  }
}

