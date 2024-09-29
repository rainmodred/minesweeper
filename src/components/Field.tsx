import React, { memo } from 'react';
import styled from 'styled-components';

import bomb from '../images/bomb.png';
import flag from '../images/flag.png';
import { CellState } from '../game/Cell';

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
  $flagged: boolean;
}

const ClosedField = styled(StyledField)<ClosedFieldProps>`
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #808080;
  border-right: 3px solid #808080;

  background-image: url('${(props) => (props.$flagged ? flag : null)}');
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
  $hasMine: boolean;
  color: string;
}

const OpenedField = styled(StyledField)<OpenedFieldProps>`
  border: none;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  background-image: url('${(props) => (props.$hasMine ? bomb : null)}');
  background-repeat: no-repeat;
  background-size: cover;
  color: ${(props) => props.color};
`;

interface FieldProps {
  state: CellState;
  hasMine: boolean;
  row: number;
  col: number;
  value: number;
}

const Field: React.FC<FieldProps> = memo(
  ({ state, hasMine, row, col, value }) => {
    const color = getColor(value);

    const field =
      state === CellState.opened ? (
        <OpenedField color={color} $hasMine={hasMine}>
          {value > 0 && value}
        </OpenedField>
      ) : (
        <ClosedField
          $flagged={state === CellState.flagged}
          data-row={row}
          data-col={col}
        />
      );

    return field;
  }
);

Field.displayName = 'Field';

export default Field;
