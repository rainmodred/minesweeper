import { IGameBoard } from '../utils/game';

interface GameboardProps {
  gameBoard: IGameBoard;
  lostMine: string | null;
  onDig: (key: string) => void;
  onFlag: (key: string) => void;
  onDigTry: () => void;
  onChord: (key: string) => void;
}

export function Gameboard({
  gameBoard,
  lostMine,
  onDig,
  onChord,
  onFlag,
  onDigTry,
}: GameboardProps) {
  function flag(e: React.MouseEvent, key: string) {
    e.preventDefault();
    onFlag(key);
  }

  return (
    <div className="gameboard" data-testid="gameboard">
      {[...gameBoard].map(([key, cell]) => {
        if (cell.state === 'closed') {
          return (
            <div
              data-testid={key}
              data-closed={true}
              onClick={() => onDig(key)}
              onContextMenu={(e) => flag(e, key)}
              onMouseDown={onDigTry}
              className={`cell ${cell.hasFlag ? 'flag' : ''}`}
              key={key}
            ></div>
          );
        }

        if (cell.state === 'opened') {
          if (cell.value === 'mine') {
            //show clicked mine
            if (lostMine === key) {
              return (
                <div
                  data-closed={false}
                  data-testid={key}
                  data-mine={true}
                  className="cell opened mine red"
                  key={key}
                ></div>
              );
            }
            return (
              <div
                data-mine={true}
                data-closed={false}
                data-testid={key}
                className="cell opened mine"
                key={key}
              ></div>
            );
          }

          if (cell.value === 0) {
            return (
              <div
                data-closed={false}
                data-testid={key}
                className="cell opened"
                key={key}
              ></div>
            );
          }

          return (
            <div
              data-closed={false}
              data-testid={key}
              onClick={() => onChord(key)}
              className={`cell opened number-${cell.value}`}
              key={key}
            >
              {cell.value}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
