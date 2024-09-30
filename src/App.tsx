import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import './App.css';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const GlobalStyle = createGlobalStyle`
  *, *::after, *::before {
    padding: 0;
    margin: 0;
    box-sizing: inherit;
    font-family: Arial, Helvetica, sans-serif;
  }
  body {
    box-sizing: border-box;
    background-color: #262626;
  }
`;

interface Cell {
  state: 'opened' | 'closed';
  value: 'mine' | number;
  flag: boolean;
}

function getMineCells(
  width: number,
  height: number,
  mineCount: number
): Set<string> {
  const res = new Set<string>();
  while (res.size < mineCount) {
    const row = Math.floor(Math.random() * height);
    const col = Math.floor(Math.random() * width);
    const key = `${row}:${col}`;
    res.add(key);
  }
  return res;
}

type IGameboard = Map<string, Cell>;

// Safe first click?
function createGrid(width: number, height: number, mineCount: number) {
  const grid: IGameboard = new Map();
  const state: 'opened' | 'closed' = 'closed';
  const mineCells = getMineCells(width, height, mineCount);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const key = `${i}:${j}`;
      if (mineCells.has(key)) {
        grid.set(key, { state, value: 'mine', flag: false });
      } else {
        const count = getMinesCount(mineCells, key);
        grid.set(key, { state, value: count, flag: false });
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

function revealArea(gameboard: IGameboard, key: string): IGameboard {
  const cell = gameboard.get(key)!;
  console.log(cell, key);
  if (cell.state === 'opened') {
    return gameboard;
  }

  if (cell.value === 'mine' || cell.value > 0) {
    gameboard.set(key, { ...cell, state: 'opened' });
    return gameboard;
  }

  gameboard.set(key, { ...cell, state: 'opened' });

  const neighbors = getNeighbors(key, 9, 9);
  for (const n of neighbors) {
    revealArea(gameboard, n);
  }
  return gameboard;
}

function NewGame() {
  const [gameboard, setGameboard] = useState(createGrid(9, 9, 9));

  function dig(key: string) {
    const cell = gameboard.get(key);
    if (!cell) {
      throw new Error(`Cell ${key} not found`);
    }

    // if (cell.value === 0) {
    // }

    const temp = new Map(gameboard);
    setGameboard(revealArea(temp, key));

    // setGameboard(
    //   new Map(gameboard).set(key, { state: 'opened', value: cell.value })
    // );
  }

  function flag(e: React.MouseEvent, key: string) {
    e.preventDefault();
    const cell = gameboard.get(key)!;
    setGameboard(new Map(gameboard).set(key, { ...cell, flag: !cell.flag }));
  }

  return (
    <div className="gameboard">
      {[...gameboard].map(([key, cell]) => {
        if (cell.state === 'closed') {
          return (
            <div
              onClick={() => dig(key)}
              onContextMenu={(e) => flag(e, key)}
              className={`cell ${cell.flag ? 'flag' : ''}`}
              key={key}
            ></div>
          );
        }

        if (cell.state === 'opened') {
          if (cell.value === 'mine') {
            return <div className="cell opened mine" key={key}></div>;
          }

          if (cell.value === 0) {
            return <div className="cell opened" key={key}></div>;
          }

          return (
            <div className={`cell opened number-${cell.value}`} key={key}>
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

export default function App() {
  return (
    <Container>
      <GlobalStyle />
      {/* <Game grid={grid} /> */}
      <NewGame />
    </Container>
  );
}
