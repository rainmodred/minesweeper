import { IGameBoard } from './game';

//DEBUG print
export function printGameboard(gameBoard: IGameBoard) {
  let str = ``;

  let row = 0;
  for (const [, cell] of gameBoard) {
    row++;
    if (cell.state === 'closed') {
      if (cell.hasFlag) {
        str += '🚩';
      } else {
        str += '❓';
      }
    } else {
      switch (cell.value) {
        case 'mine':
          str += '💣';
          break;
        case 0:
          str += '👌';
          break;
        default:
          str += `${cell.value} `;
          break;
      }
    }

    if (row === 9) {
      row = 0;
      str += '\n';
    }
  }
  return str;
}
