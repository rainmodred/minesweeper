import { PropsWithChildren } from 'react';
import { Cell } from '@/features/Minesweeper/types';
import clsx from 'clsx';
import styles from './Cell.module.css';

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
    styles.cell,
    styles['cell--open'],
    styles[`number-${cell.value}`],
    cell.hasMine && styles['cell--mine'],
    lostMine && styles['cell--lostMine']
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
