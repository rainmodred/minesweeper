import { useState, useEffect } from 'react';
import useInterval from '../hooks/useInterval';
import { Display } from './Display';
import { State } from '../utils/game';

interface ScoreBoardProps {
  flagsCount: number;
  gameState: State;
  isDigging: boolean;
  onNewGame: () => void;
}

export function ScoreBoard({
  flagsCount,
  gameState,
  isDigging,
  onNewGame,
}: ScoreBoardProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (gameState === 'idle') {
      setSeconds(0);
    }
  }, [gameState]);

  useInterval(
    () => setSeconds(seconds + 1),
    gameState === 'started' ? 1000 : null
  );

  function getFace() {
    if (gameState === 'started' || gameState === 'idle') {
      if (isDigging) {
        return 'oh';
      }
      return 'idle';
    }
    if (gameState === 'won' || gameState === 'lost') {
      return gameState;
    }
  }

  return (
    <div className="scoreboard">
      <Display name="flags-display" num={flagsCount} />
      <button
        data-testid="smile"
        data-gamestate={gameState}
        onClick={onNewGame}
        className={`face face--${getFace()}`}
      ></button>
      <Display name="time-display" num={seconds} />
    </div>
  );
}
