export enum CellState {
  opened,
  closed,
  flagged,
}

export default class Cell {
  id: number;

  row: number;

  col: number;

  state: CellState;

  hasMine: boolean;

  value: number;

  constructor(id: number, row: number, col: number) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.state = CellState.closed;
    this.hasMine = false;
    this.value = 0;
  }

  get isFlagged() {
    return this.state === CellState.flagged;
  }

  get isOpened() {
    return this.state === CellState.opened;
  }

  toggleFlag() {
    if (this.state === CellState.flagged) {
      this.state = CellState.closed;
    } else {
      this.state = CellState.flagged;
    }
  }

  openCell() {
    if (this.state === CellState.closed) {
      this.state = CellState.opened;
    }
  }
}
