import React from 'react';
import styled from 'styled-components';

import Field from './Field';
import Cell from '../core/Cell';

interface GameboardProps {
  height: number;
  width: number;
  gameboard: Cell[][] | null;
  leftClick: (target: EventTarget) => void;
  rightClick: (target: EventTarget) => void;
}

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

const Gameboard: React.FC<GameboardProps> = ({
  height,
  width,
  gameboard,
  leftClick,
  rightClick,
}) => {
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
      onClick={(e) => leftClick(e.target)}
      onContextMenu={(e) => {
        e.preventDefault();
        rightClick(e.target);
      }}
    >
      {renderGameboard()}
    </Container>
  );
};

export default Gameboard;
