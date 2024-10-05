import clsx from 'clsx';
import { State } from '@/features/Minesweeper/types';
import styles from './ScoreBoard.module.css';

interface FaceProps {
  state: State;
  isDigging: boolean;
  onNewGame: () => void;
}
export function Face({ state, isDigging, onNewGame }: FaceProps) {
  function getFace() {
    if (state === 'started' || state === 'idle') {
      if (isDigging) {
        return 'oh';
      }
      return 'idle';
    }

    return state;
  }

  const faceStyle = `face--${getFace()}`;
  return (
    <button
      data-testid="smile"
      data-gamestate={state}
      onClick={onNewGame}
      className={clsx(styles.face, styles[faceStyle])}
    ></button>
  );
}
