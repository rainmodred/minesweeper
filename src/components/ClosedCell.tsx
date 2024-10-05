import { memo } from 'react';
import { Cell } from '../utils/minesweeper';
import clsx from 'clsx';

interface ClosedCellProps {
  cell: Cell;
  cellKey: string;
  onDig: (key: string) => void;
  onDigTry: () => void;
  onFlag: (key: string) => void;
}
export const ClosedCell = memo(function ClosedCell({
  cell,
  cellKey,
  onDig,
  onDigTry,
  onFlag,
}: ClosedCellProps) {
  function flag(e: React.MouseEvent, key: string) {
    e.preventDefault();
    onFlag(key);
  }

  return (
    <div
      data-testid={cellKey}
      data-closed={true}
      data-flag={cell.hasFlag}
      onClick={() => onDig(cellKey)}
      onContextMenu={(e) => flag(e, cellKey)}
      onMouseDown={onDigTry}
      className={clsx('cell', cell.hasFlag && 'flag')}
      key={cellKey}
    ></div>
  );
});
