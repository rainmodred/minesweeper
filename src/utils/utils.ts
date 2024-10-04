import { GameBoard } from './game';

//DEBUG print
export function printGameboard(gameBoard: GameBoard, width: number) {
  let str = ``;

  let col = 0;
  for (const [, cell] of gameBoard) {
    col++;
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

    if (col === width) {
      col = 0;
      str += '\n';
    }
  }
  return str;
}
