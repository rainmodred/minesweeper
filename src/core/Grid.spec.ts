import Grid from './Grid';

describe('Grid', () => {
  let grid = new Grid(9, 9, 10);
  beforeEach(() => {
    grid = new Grid(9, 9, 10);
  });

  it('can create grid', () => {
    expect(grid.matrix.length).toEqual(grid.height);
    expect(grid.matrix[8].length).toEqual(grid.width);
  });

  it('has 10 mines', () => {
    let mines = 0;

    grid.matrix.forEach((row) =>
      row.forEach((cell) => {
        if (cell.hasMine) {
          mines++;
        }
      })
    );

    expect(grid.minesQuantity).toEqual(mines);
    expect(grid.minesQuantity).toEqual(10);
  });

  it('can open empty cell', () => {
    const cell = grid.getCell(0, 0);

    expect(cell.isOpened).toBeFalsy();

    grid.openCell(0, 0);

    expect(cell.isOpened).toBeTruthy();
  });

  it("can't open flagged cell", () => {
    const cell = grid.getCell(0, 0);

    expect(cell.isOpened).toBeFalsy();
    expect(cell.isFlagged).toBeFalsy();

    grid.toggleFlag(0, 0);
    grid.openCell(0, 0);

    expect(cell.isOpened).toBeFalsy();
    expect(cell.isFlagged).toBeTruthy();
  });

  it('can open multiple cells', () => {
    grid = new Grid(9, 9, 0);
    /*
      [
        [0, 0, 0, 1, 0, M, 0, 0, 0],
        [0, 0, 0, 3, M, 0, 0, 0, 0],
        [2, 3, 3, 5, M, 0, 0, 0, 0],
        [M, M, M, M, M, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ]
    */

    grid.matrix[0][5].hasMine = true;
    grid.matrix[1][4].hasMine = true;
    grid.matrix[2][4].hasMine = true;
    grid.matrix[3][4].hasMine = true;
    grid.matrix[3][3].hasMine = true;
    grid.matrix[3][2].hasMine = true;
    grid.matrix[3][1].hasMine = true;
    grid.matrix[3][0].hasMine = true;

    grid.matrix[2][0].value = 2;
    grid.matrix[2][1].value = 3;
    grid.matrix[2][2].value = 3;
    grid.matrix[2][3].value = 5;
    grid.matrix[1][3].value = 3;
    grid.matrix[0][3].value = 1;
    grid.matrix[0][4].value = 2;

    grid.minesQuantity = 8;

    grid.showCell(0, 0);

    expect(grid.getCell(0, 0).isOpened).toBeTruthy();
    expect(grid.getCell(0, 1).isOpened).toBeTruthy();
    expect(grid.getCell(0, 2).isOpened).toBeTruthy();
    expect(grid.getCell(0, 3).isOpened).toBeTruthy();
    expect(grid.getCell(0, 4).isOpened).toBeFalsy();
    expect(grid.getCell(1, 0).isOpened).toBeTruthy();
    expect(grid.getCell(1, 1).isOpened).toBeTruthy();
    expect(grid.getCell(1, 2).isOpened).toBeTruthy();
    expect(grid.getCell(1, 3).isOpened).toBeTruthy();
    expect(grid.getCell(2, 0).isOpened).toBeTruthy();
    expect(grid.getCell(2, 1).isOpened).toBeTruthy();
    expect(grid.getCell(2, 2).isOpened).toBeTruthy();
    expect(grid.getCell(2, 3).isOpened).toBeFalsy();
  });

  it('can move mine', () => {
    grid = new Grid(9, 9, 0);

    grid.minesQuantity = 1;
    grid.getCell(1, 1).hasMine = true;

    grid.getCell(0, 0).value = 1;
    grid.getCell(0, 1).value = 1;
    grid.getCell(0, 2).value = 1;
    grid.getCell(1, 0).value = 1;
    grid.getCell(1, 2).value = 1;
    grid.getCell(2, 0).value = 1;
    grid.getCell(2, 1).value = 1;
    grid.getCell(2, 2).value = 1;

    grid.moveMine(1, 1);

    let movedCell = null;
    for (const row of grid.matrix) {
      for (const cell of row) {
        if (cell.hasMine) {
          movedCell = cell;
        }
      }
    }

    const { row, col } = movedCell!;
    let aroundCells = true;
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (
          i >= 0 &&
          i < grid.matrix.length &&
          j >= 0 &&
          j < grid.matrix[0].length
        ) {
          if (grid.matrix[i][j].value === 0 && i !== row && j !== col) {
            aroundCells = false;
            break;
          }
        }
      }
    }

    expect(aroundCells).toBeTruthy();
  });
});
