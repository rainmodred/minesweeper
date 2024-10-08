import { useState, useEffect, PropsWithChildren } from 'react';
import useInterval from '@/hooks/useInterval';
import { Display } from './Display';
import { State } from '@/features/Minesweeper/types';
import styles from './ScoreBoard.module.css';

interface ScoreBoardProps {
  flagsCount: number;
  gameState: State;
}

export function ScoreBoard({
  flagsCount,
  gameState,
  children,
}: PropsWithChildren<ScoreBoardProps>) {
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

  return (
    <div className={styles.scoreboard}>
      <Display name="flags-display" num={flagsCount} />
      {children}
      <Display name="time-display" num={seconds} />
    </div>
  );
}
