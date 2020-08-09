import Cell, { CellState } from './Cell';
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

    this.setCellValue();
  }

  private setCellValue() {
    return this.matrix.map(row => {
      return row.map(cell => {
        if (!cell.hasMine) {
          cell.setValue(this.findMinesAround(cell.row, cell.col));
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

  getValue(row: number, col: number) {
    return this.matrix[row][col].getValue();
  }

  getCell(row: number, col: number) {
    return this.matrix[row][col];
  }

  isOpened(row: number, col: number) {
    return this.matrix[row][col].isOpened();
  }

  setState(row: number, col: number, newState: CellState) {
    this.getCell(row, col).setValue(newState);
  }

  isFlagged(row: number, col: number) {
    return this.matrix[row][col].isFlagged();
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
      return cell.hasMine;
    }

    if (cell.value !== 0) {
      cell.openCell();
    } else {
      this.floodFill(cell);
    }
    return false;
  }

  reveal() {
    this.matrix.forEach((row) => row.map((cell) => cell.openCell()));
  }


  // refacotr with tests?
  private floodFill(cell: Cell) {
    const que: Cell[] = [];
    const { height } = this;
    const { width } = this;

    cell.openCell();
    let openedCells = 0;

    que.push(cell);
    while (que.length !== 0) {
      const { row, col } = que.shift()!;
      openedCells++;

      // WEST
      if (col - 1 >= 0 && col < width) {
        if (this.getValue(row, col - 1) === 0 && !this.isOpened(row, col - 1) && !this.isFlagged(row, col - 1)) {
          this.openCell(row, col - 1);
          que.push(this.getCell(row, col - 1));
        } else {
          this.openCell(row, col - 1);
          openedCells++;
        }
      }
      // EAST
      if (col >= 0 && col + 1 < width) {
        if (this.getValue(row, col + 1) === 0 && !this.isOpened(row, col + 1) && !this.isFlagged(row, col + 1)) {
          this.openCell(row, col + 1);
          que.push(this.getCell(row, col + 1));
        } else {
          this.openCell(row, col + 1);
          openedCells++;
        }
      }
      // NORTH
      if (row - 1 >= 0 && row < height) {
        if (this.getValue(row - 1, col) === 0 && !this.isOpened(row - 1, col) && !this.isFlagged(row - 1, col)) {
          this.openCell(row - 1, col);
          que.push(this.getCell(row - 1, col));
        } else {
          this.openCell(row - 1, col);
          openedCells++;
        }
      }
      // SOUTH
      if (row >= 0 && row + 1 < height) {
        if (this.getValue(row + 1, col) === 0 && !this.isOpened(row + 1, col) && !this.isFlagged(row + 1, col)) {
          this.openCell(row + 1, col);
          que.push(this.getCell(row + 1, col));
        } else {
          this.openCell(row + 1, col);
          openedCells++;
        }
      }
    }

    return openedCells;
  }
}

