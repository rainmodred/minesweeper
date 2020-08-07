export default class Cell {
  id: number;

  row: number;

  col: number;

  isOpened: boolean;

  hasMine: boolean;

  hasFlag: boolean;

  minesAround: number;

  constructor(id: number,
    row: number,
    col: number,
    isOpened: boolean,
    hasMine: boolean,
    hasFlag: boolean,
    minesAroud: number) {

    this.id = id;
    this.row = row;
    this.col = col;
    this.isOpened = isOpened;
    this.hasMine = hasMine;
    this.hasFlag = hasFlag;
    this.minesAround = minesAroud;
  }

  setMine() {
    this.hasMine = true;
  }

  removeMine() {
    this.hasMine = false;
  }

  setMinesAround(amount: number) {
    this.minesAround = amount;
  }
}
