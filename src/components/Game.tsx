import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import GameBoard from './Gameboard';
import Grid from '../core/Grid';
import Cell from '../core/Cell';
import ScoreBoard from './ScoreBoard';
import Menu from './Menu';
import { Difficulty, difficulties } from '../core/difficulties';

const Container = styled.div`
  display: inline-block;
  margin-top: 5%;
  min-height: 300px;
  background-color: #c0c0c0;
  box-shadow: 3px 3px 1px 0px rgba(128, 128, 128, 1);
  padding: 9px;
  position: relative;
`;

const StyledButton = styled.span`
  display: inline;
  color: blue;
  text-decoration: underline;
  position: absolute;
  background: transparent;
  border: none;
  top: -18px;
  left: 0;
  cursor: pointer;
  user-select: none;
`;

export enum GameState {
  lost,
  won,
  started,
  initial,
}

let grid = new Grid(9, 9, 10);

const Game: React.FC = () => {
  const [gameboard, setGameboard] = useState<Cell[][] | null>(grid.matrix);
  const [gameState, setGameState] = useState(GameState.initial);
  const [flagsLeft, setFlagsLeft] = useState(10);
  const [currentDifficulty, setCurrentDifficulty] = useState(
    difficulties.Beginner
  );
  const [menuVisibility, setMenuVisibility] = useState(false);

  // debug
  useEffect(() => {
    grid.print();
  }, []);

  function finishGame(state: string) {
    if (state === 'lost') {
      grid.reveal();
      setGameState(GameState.lost);
      setGameboard(grid.matrix);
    }
  }

  function handleGameboardLeftClick(target: EventTarget) {
    const cell = target as HTMLElement;
    if (target) {
      const row = Number(cell?.dataset.row!);
      const col = Number(cell?.dataset.col!);

      if (Number.isInteger(row) && Number.isInteger(col)) {
        if (gameState === GameState.initial && grid.getCell(row, col).hasMine) {
          grid.moveMine(row, col);
          setGameboard(grid.matrix.slice());
        }

        const result = grid.showCell(row, col);
        if (result === null) {
          return;
        }
        if (result) {
          finishGame('lost');
        }
        if (!result) {
          setGameState(GameState.started);
          setGameboard(grid.matrix.slice());
        }
      }
    }
  }

  function handleGameboardRightClick(target: EventTarget) {
    const cell = target as HTMLElement;
    if (
      target &&
      (gameState === GameState.initial || gameState === GameState.started)
    ) {
      const { row, col } = cell?.dataset!;

      if (row && col) {
        setFlagsLeft(flagsLeft - 1);
        grid.toggleFlag(+row, +col);
        setGameboard(grid.matrix.slice());
      }
    }
  }

  function handleNewGame(difficulty: Difficulty) {
    setCurrentDifficulty(difficulty);
    setGameState(GameState.initial);
    setFlagsLeft(difficulty.minesQuantity);
    grid = new Grid(
      difficulty.height,
      difficulty.width,
      difficulty.minesQuantity
    );
    setGameboard(grid.matrix.slice());
    grid.print();
  }

  return (
    <Container>
      <Menu
        visible={menuVisibility}
        onCloseMenu={() => setMenuVisibility(!menuVisibility)}
        onNewGame={handleNewGame}
      />
      <StyledButton onClick={() => setMenuVisibility(!menuVisibility)}>
        Settings
      </StyledButton>
      <ScoreBoard
        difficulty={currentDifficulty}
        flagsLeft={flagsLeft}
        onNewGame={handleNewGame}
        gameState={gameState}
      />
      <GameBoard
        height={currentDifficulty.height}
        width={currentDifficulty.width}
        gameboard={gameboard}
        leftClick={handleGameboardLeftClick}
        rightClick={handleGameboardRightClick}
      />
    </Container>
  );
};

export default Game;
