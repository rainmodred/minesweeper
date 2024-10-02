import React, { useEffect, useState } from 'react';
import './App.css';
import useInterval from './hooks/useInterval';

import face1 from './images/face-idle.png';
import Digit from './components/Digit';
import { difficulties, Difficulty } from './game/difficulties';

interface Cell {
  state: 'opened' | 'closed';
  value: 'mine' | number;
  hasFlag: boolean;
}

function getMineCells(
  { width, height, minesCount }: Difficulty,
  skipKey?: string
): Set<string> {
  const res = new Set<string>();
  while (res.size < minesCount) {
    // console.log(res.size, minesCount);
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const key = `${row}:${col}`;
    if (key !== skipKey) {
      res.add(key);
    }
  }
  return res;
}

type IGameboard = Map<string, Cell>;

// Safe first click?
function createGameboard(
  { width, height, minesCount }: Difficulty,
  skipKey?: string
) {
  const grid: IGameboard = new Map();
  const state: 'opened' | 'closed' = 'closed';
  const mineCells = getMineCells({ width, height, minesCount }, skipKey);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = `${i}:${j}`;
      if (mineCells.has(key)) {
        grid.set(key, { state, value: 'mine', hasFlag: false });
      } else {
        const count = getMinesCount(mineCells, key);
        grid.set(key, { state, value: count, hasFlag: false });
      }
    }
  }

  return grid;
}

//use global witdh?
function getNeighbors(key: string, width: number, height: number): string[] {
  const [row, col] = key.split(':').map(Number);
  const aroundCells = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ]
    .filter(([r, c]) => r >= 0 && c >= 0 && r < width && c < height)
    .map(([r, c]) => `${r}:${c}`);
  return aroundCells;
}

function getMinesCount(grid: Set<string>, key: string) {
  const neighbors = getNeighbors(key, 9, 9);

  let count = 0;
  for (const key of neighbors) {
    if (grid.has(key)) {
      count++;
    }
  }

  return count;
}

function revealArea(gameBoard: IGameboard, key: string): IGameboard {
  const cell = gameBoard.get(key)!;
  if (cell.state === 'opened') {
    return gameBoard;
  }

  if (cell.value === 'mine' || cell.value > 0) {
    gameBoard.set(key, { ...cell, state: 'opened' });
    return gameBoard;
  }

  gameBoard.set(key, { ...cell, state: 'opened' });

  const neighbors = getNeighbors(key, 9, 9);
  for (const n of neighbors) {
    revealArea(gameBoard, n);
  }
  return gameBoard;
}

// TODO: remove
function mineCell(gameboard: IGameboard) {
  for (const [key, value] of gameboard) {
    if (value.value === 'mine') {
      console.log(key);
      break;
    }
  }
}

function convert(num: number): string[] {
  if (num > 999) return ['9', '9', '9'];
  if (num < -99) return ['-', '9', '9'];

  const digits = num.toString().split('');
  while (digits.length < 3) {
    digits.unshift('0');
  }
  return digits;
}

interface NumbersFieldProps {
  num: number;
}

function NumbersField({ num }: NumbersFieldProps) {
  const digits = convert(num);
  return (
    <div className="numbers-field">
      {digits.map((d, i) => {
        return <Digit digit={d} key={i} />;
      })}
    </div>
  );
}

interface GameboardProps {
  gameBoard: IGameboard;
  lostMine: string | null;
  onDig: (key: string) => void;
  onFlag: (key: string) => void;
  onDigTry: () => void;
  onChord: (key: string) => void;
}

function Gameboard({
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

  // return <>{[...grid].map()}</>;
}

type GameState = 'won' | 'lost' | 'started' | 'idle';

interface ScoreBoardProps {
  flagsCount: number;
  gameState: GameState;
  isDigging: boolean;
  onNewGame: () => void;
}

function ScoreBoard({
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
      <NumbersField num={flagsCount} />
      <button
        data-testid="smile"
        data-gamestate={gameState}
        onClick={onNewGame}
        className={`face face--${getFace()}`}
      ></button>
      <NumbersField num={seconds} />
    </div>
  );
}

//TODO :DEBUG
function printGameboard(gameBoard: IGameboard) {
  let str = ``;

  let row = 0;
  for (const [, cell] of gameBoard) {
    row++;
    if (cell.state === 'closed') {
      if (cell.hasFlag) {
        str += '🚩';
      } else {
        str += '❓';
      }
    } else {
      switch (cell.value) {
        case 'mine':
          str += '💣';
          break;
        case 0:
          str += '👌';
          break;
        default:
          str += `${cell.value} `;
          break;
      }
    }

    if (row === 9) {
      row = 0;
      str += '\n';
    }
  }
  console.log(str);
}

interface GameProps {
  difficulty: Difficulty;
}

export function Game({ difficulty }: GameProps) {
  const [gameBoard, setGameBoard] = useState(createGameboard(difficulty));
  const [gameState, setGameState] = useState<GameState>('idle');

  const [flagsCount, setFlagsCount] = useState(9);
  const [lostMine, setLostMine] = useState<string | null>(null);
  const [isDigging, setIsDigging] = useState(false);

  console.log([...gameBoard].filter(([, c]) => c.value === 'mine'));
  console.log(printGameboard(gameBoard));

  useEffect(() => {
    const count = [...gameBoard].filter(([, c]) => c.state === 'closed').length;
    if (count === difficulty.minesCount) {
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
    setGameBoard(createGameboard(difficulty));
    setGameState('idle');
    setFlagsCount(9);
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
        newBoard = createGameboard(difficulty, key);
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

    // const temp = new Map(newBoard ? newBoard : gameBoard);

    setGameBoard((gameBoard) => {
      const temp = new Map(newBoard ? newBoard : gameBoard);
      return revealArea(temp, key);
    });
  }

  function chord(key: string) {
    const cell = gameBoard.get(key)!;
    const neighbors = getNeighbors(key, 9, 9);
    const flaggedCells = neighbors
      .map((k) => gameBoard.get(k))
      .filter((c) => c?.hasFlag);
    const hasEnoughtFlags = flaggedCells.length === cell.value;
    if (!hasEnoughtFlags) {
      return;
    }
    // console.log({ hasEnoughtFlags, flaggedCells, neighbors });

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
      {/* <Game grid={new Grid(9, 9, 9)} /> */}
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

export default function App() {
  return (
    <>
      <Game difficulty={{ ...difficulties['Beginner'], minesCount: 2 }} />
    </>
  );
}
