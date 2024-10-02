import { useState, useEffect } from 'react';
import { Difficulty as Setting } from '../utils/difficulties';
import {
  createGameBoard,
  getNeighbors,
  isWon,
  revealArea,
} from '../utils/game';
import { Gameboard } from './GameBoard';
import { ScoreBoard } from './ScoreBoard';
import { printGameboard } from '../utils/utils';

export type GameState = 'won' | 'lost' | 'started' | 'idle';

interface GameProps {
  difficulty: Setting;
  getMineCells: (setting: Setting, skipKey?: string) => Set<string>;
}

export function Game({ difficulty, getMineCells }: GameProps) {
  const [gameBoard, setGameBoard] = useState(
    createGameBoard(difficulty, getMineCells)
  );
  const [gameState, setGameState] = useState<GameState>('idle');

  const [flagsCount, setFlagsCount] = useState(9);
  const [lostMine, setLostMine] = useState<string | null>(null);
  const [isDigging, setIsDigging] = useState(false);

  // console.log([...gameBoard].filter(([, c]) => c.value === 'mine'));
  console.log(printGameboard(gameBoard));

  useEffect(() => {
    if (isWon(gameBoard, difficulty)) {
      setGameState('won');
    }
  }, [gameBoard]);

  useEffect(() => {
    function handleMouseUp() {
      if (gameState === 'started' || gameState === 'idle') {
        setIsDigging(false);
      }
    }
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [gameState]);

  function newGame() {
    setGameBoard(createGameBoard(difficulty, getMineCells));
    setGameState('idle');
    setFlagsCount(difficulty.minesCount);
  }

  function revealMines() {
    const temp = new Map(gameBoard);
    for (const [key, cell] of temp) {
      if (cell.value === 'mine' && !cell.hasFlag) {
        temp.set(key, { ...cell, state: 'opened' });
      }
    }

    setGameBoard(temp);
  }

  function isGameOver(): boolean {
    if (gameState === 'won' || gameState === 'lost') {
      return true;
    }
    return false;
  }

  function dig(key: string) {
    if (isGameOver()) {
      return;
    }

    let cell = gameBoard.get(key)!;
    if (cell.state === 'opened') {
      return;
    }

    //safe first click
    let newBoard = null;
    if (gameState === 'idle') {
      setGameState('started');
      if (cell.value === 'mine') {
        newBoard = createGameBoard(difficulty, getMineCells, key);
        cell = newBoard.get(key)!;
        setGameBoard(newBoard);
      }
    }

    if (cell.hasFlag) {
      return;
    }

    if (cell.value === 'mine') {
      setGameState('lost');
      setLostMine(key);
      revealMines();
      return;
    }

    setGameBoard((gameBoard) => {
      const temp = new Map(newBoard ? newBoard : gameBoard);
      return revealArea(temp, key);
    });
  }

  function chord(key: string) {
    const cell = gameBoard.get(key)!;
    const neighbors = getNeighbors(difficulty.width, difficulty.height, key);
    const flaggedCells = neighbors
      .map((k) => gameBoard.get(k))
      .filter((c) => c?.hasFlag);
    const hasEnoughtFlags = flaggedCells.length === cell.value;
    if (!hasEnoughtFlags) {
      return;
    }

    for (const n of neighbors) {
      dig(n);
    }
  }

  function flag(key: string) {
    if (isGameOver()) {
      return;
    }
    const cell = gameBoard.get(key)!;
    setGameBoard(
      new Map(gameBoard).set(key, { ...cell, hasFlag: !cell.hasFlag })
    );
    setFlagsCount(flagsCount - 1);
  }

  return (
    <div className="app">
      <div className="game">
        <ScoreBoard
          onNewGame={newGame}
          gameState={gameState}
          flagsCount={flagsCount}
          isDigging={isDigging}
        />
        <Gameboard
          gameBoard={gameBoard}
          lostMine={lostMine}
          onDig={dig}
          onFlag={flag}
          onDigTry={() => setIsDigging(true)}
          onChord={chord}
        />
      </div>
    </div>
  );
}
