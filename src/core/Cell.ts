export enum CellState {
  opened,
  closed,
  flagged
}

export default class Cell {
  id: number;

  row: number;

  col: number;

  state: CellState;

  hasMine: boolean;

  value: number;

  constructor(id: number,
    row: number,
    col: number,
  ) {

    this.id = id;
    this.row = row;
    this.col = col;
    this.state = CellState.closed;
    this.hasMine = false;
    this.value = 0;
  }

  isFlagged() {
    return this.state === CellState.flagged;
  }

  isOpened() {
    return this.state === CellState.opened;
  }

  toggleFlag() {
    if (this.state === CellState.flagged) {
      this.state = CellState.closed;
    } else {
      this.state = CellState.flagged;
    }
  }

  getValue() {
    return this.value;
  }

  setValue(newValue: number) {
    this.value = newValue;
  }

  setState(newState: CellState) {
    this.state = newState;
  }

  setMine() {
    this.hasMine = true;
  }

  openCell() {
    if (this.state === CellState.closed) {
      this.state = CellState.opened;
    }
  }

}
