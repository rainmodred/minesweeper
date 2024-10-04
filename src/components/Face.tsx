import clsx from 'clsx';
import { State } from '../utils/game';

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
      className={clsx('face', faceStyle)}
    ></button>
  );
}
