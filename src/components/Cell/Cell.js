import React from 'react';
import styled from 'styled-components';

import bomb from '../../assets/bomb.png';
import flag from '../../assets/flag.png';

const colors = {
  '1': '#0000ff',
  '2': '#008200',
  '3': '#ff0000',
  '4': '#000084',
  '5': '#840000',
  '6': '#008284',
  '7': '#840084',
  '8': '#757575',
};

const StyledCell = styled.div`
  font-family: 'Changa One', sans-serif;
  font-size: 24px;
  width: 24px;
  height: 24px;
  font-weight: 400;
  line-height: 24px;
  text-align: center;
  user-select: none;
`;

const ClosedCell = styled(StyledCell)`
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #808080;
  border-right: 3px solid #808080;

  background-image: url('${props => (props.hasFlag ? flag : null)}');
  background-repeat: no-repeat;
  background-size: 65%;
  background-position: center;

  &:active {
    border: none;
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
  }


`;

const OpenedCell = styled(StyledCell)` 
  border: none;
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  background-image: url('${props => (props.hasMine ? bomb : null)}');
  background-repeat: no-repeat;
  background-size: cover;
  color: ${props => colors[`${props.neigbours}`]};
`;

const Cell = ({
  hasMine,
  hasFlag,
  isOpened,
  neighbourMineCount,
  row,
  col,
  leftClick,
  rightClick,
}) => {
  let neigbours = hasMine || neighbourMineCount === 0 ? null : neighbourMineCount;
  let cell = isOpened ? (
    <OpenedCell neigbours={neigbours} hasMine={hasMine}>
      {neigbours}
    </OpenedCell>
  ) : (
    <ClosedCell
      hasFlag={hasFlag}
      onClick={() => leftClick(row, col)}
      onContextMenu={event => rightClick(event, row, col)}
    />
  );
  return cell;
};

export default Cell;
