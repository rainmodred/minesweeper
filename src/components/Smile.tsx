import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 40px;
  height: 40px;
  border-top: 4px solid #fff;
  border-left: 4px solid #fff;
  border-bottom: 5px solid #808080;
  border-right: 5px solid #808080;
  background-size: 30px;
  background-position: center;
  &:active {
    border-top: 4px solid #808080;
    border-left: 4px solid #808080;
    border-bottom: 2px solid #808080;
    border-right: 2px solid #808080;
  }
`;

interface SmileProps {
  onNewGame: () => void;
}

const Smile: React.FC<SmileProps> = ({ children, onNewGame }) => {
  return <Container onClick={onNewGame}>{children}</Container>;
};

export default Smile;
