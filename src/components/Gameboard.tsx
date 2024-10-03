import { memo, PropsWithChildren } from 'react';

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
      className="gameboard"
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
