import React from 'react';
import styled from 'styled-components';

const StyledCell = styled.div`
  width: 24px;
  height: 24px;
  border-top: 3px solid #fff;
  border-left: 3px solid #fff;
  border-bottom: 3px solid #808080;
  border-right: 3px solid #808080;
  &:active {
    border: none;
    border-top: 1px solid #808080;
    border-left: 1px solid #808080;
  }
`;

const Cell = () => {
  return <StyledCell>{/*  */}</StyledCell>;
};

export default Cell;
