import React from 'react';
import styled from 'styled-components';

import bomb from '../images/bomb.png';
import flag from '../images/flag.png';

type Colors = {
  [key: number]: string;
};

function getColor(num: number): string {
  const colors: Colors = {
    1: '#0000ff',
    2: '#008200',
    3: '#ff0000',
    4: '#000084',
    5: '#840000',
    6: '#008284',
    7: '#840084',
    8: '#757575',
  };

  return colors[num];
}

const StyledField = styled.div`
  font-family: 'Changa One', sans-serif;
  font-size: 24px;
  width: 24px;
  height: 24px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  user-select: none;
`;

interface ClosedFieldProps {
  hasFlag: boolean;
}

const ClosedField = styled(StyledField)<ClosedFieldProps>`
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #808080;
  border-right: 3px solid #808080;

  background-image: url('${(props) => (props.hasFlag ? flag : null)}');
  background-repeat: no-repeat;
  background-size: 65%;
  background-position: center;

  &:active {
    border: none;
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
  }
`;

interface OpenedFieldProps {
  hasMine: boolean;
  color: string;
}

const OpenedField = styled(StyledField)<OpenedFieldProps>`
  border: none;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  background-image: url('${(props) => (props.hasMine ? bomb : null)}');
  background-repeat: no-repeat;
  background-size: cover;
  color: ${(props) => props.color};
`;

interface FieldProps {
  hasFlag: boolean;
  hasMine: boolean;
  isOpened: boolean;
  row: number;
  col: number;
  minesAround: number;
  leftClick?: () => {};
  rightClick?: () => {};
}

const Field: React.FC<FieldProps> = ({
  hasFlag,
  hasMine,
  isOpened,
  row,
  col,
  minesAround,
}) => {
  const color = getColor(minesAround);

  const field = isOpened ? (
    <OpenedField color={color} hasMine={hasMine}>
      {minesAround}
    </OpenedField>
  ) : (
    <ClosedField
      hasFlag={hasFlag}
      data-row={row}
      data-col={col}
      // onClick={() => leftClick(row, col)}
      // onContextMenu={(event) => rightClick(event, row, col)}
    />
  );

  return field;
};

// const Cell = ({
//   hasMine,
//   hasFlag,
//   isOpened,
//   neighbourMineCount,
//   row,
//   col,
//   leftClick,
//   rightClick,
// }) => {
//   const neigbours =
//     hasMine || neighbourMineCount === 0 ? null : neighbourMineCount;
//   const cell = isOpened ? (
//     <OpenedCell neigbours={neigbours} hasMine={hasMine}>
//       {neigbours}
//     </OpenedCell>
//   ) : (
//     <ClosedCell
//       hasFlag={hasFlag}
//       onClick={() => leftClick(row, col)}
//       onContextMenu={(event) => rightClick(event, row, col)}
//     />
//   );
//   return cell;
// };

export default Field;
