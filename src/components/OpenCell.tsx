import { PropsWithChildren } from 'react';
import { Cell } from '../utils/minesweeper';
import clsx from 'clsx';

interface Props {
  cell: Cell & { id: string };
  lostMine: boolean;
  onChord: () => void;
}

export function OpenCell({
  cell,
  lostMine,
  onChord,
}: PropsWithChildren<Props>) {
  function handleClick() {
    if (cell.value === 0 || cell.hasMine) {
      return;
    }

    onChord();
  }

  const classes = clsx(
    `cell opened number-${cell.value}`,
    cell.hasMine && 'mine',
    lostMine && 'red'
  );

  return (
    <div
      data-closed={false}
      data-testid={cell.id}
      data-mine={cell.hasMine}
      onClick={handleClick}
      className={classes}
      key={cell.id}
    >
      {cell.value > 0 && cell.value}
    </div>
  );
}
