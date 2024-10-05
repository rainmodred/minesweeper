import { memo, PropsWithChildren } from 'react';
import styles from './GameBoardWrapper.module.css';

interface GameboardProps {
  width: number;
  height: number;
}

export const GameboardWrapper = memo(function Gameboard({
  width,
  height,
  children,
}: PropsWithChildren<GameboardProps>) {
  return (
    <div
      className={styles.gameboard}
      data-testid="gameboard"
      style={{
        gridTemplateColumns: `repeat(${width}, 24px)`,
        gridTemplateRows: `repeat(${height}, 24px)`,
      }}
    >
      {children}
    </div>
  );
});
