import React from 'react';
import styled from 'styled-components';

import Field from './Field';
import Cell from '../core/Cell';

import { Face } from '../types';

interface ContainerProps {
  height: number;
  width: number;
}

const Container = styled.div<ContainerProps>`
  display: grid;
  grid-template: repeat(${(props) => props.height}, 24px) / repeat(
      ${(props) => props.width},
      24px
    );
  margin: 0 auto;
  margin-top: 9px;
  border-top: 3px solid #808080;
  border-left: 3px solid #808080;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
`;

interface GameboardProps {
  height: number;
  width: number;
  gameboard: Cell[][] | null;
  onLeftClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  onFaceChange: (face: Face) => void;
}

const Gameboard: React.FC<GameboardProps> = ({
  height,
  width,
  gameboard,
  onLeftClick,
  onRightClick,
  onFaceChange,
}) => {
  function handleLeftClick(event: React.MouseEvent<HTMLElement>) {
    const cell = event.target as HTMLElement;
    const { row, col } = cell?.dataset!;
    if (row && col) {
      onLeftClick(+row, +col);
    }
  }

  function handleRightClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    const cell = event.target as HTMLElement;
    const { row, col } = cell?.dataset!;
    if (row && col) {
      onRightClick(+row, +col);
    }
  }

  function renderGameboard() {
    if (gameboard === null) {
      return null;
    }

    return gameboard.map((row: Cell[]) =>
      row.map((cell: Cell) => (
        <Field
          key={cell.id}
          hasMine={cell.hasMine}
          state={cell.state}
          row={cell.row}
          col={cell.col}
          value={cell.value}
        />
      ))
    );
  }

  return (
    <Container
      height={height}
      width={width}
      onClick={handleLeftClick}
      onMouseDown={() => onFaceChange(Face.oh)}
      onContextMenu={handleRightClick}
    >
      {renderGameboard()}
    </Container>
  );
};

export default Gameboard;
