import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import useInterval from '../hooks/useInterval';

import face1 from '../images/face1.png';
import face2 from '../images/face2.png';
import face3 from '../images/face3.png';
import face4 from '../images/face4.png';
import Digit from './Digit';
import { Difficulty } from '../core/difficulties';
import { GameState } from './Game';

const StyledScoreBoard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  min-width: 220px;
  height: 55px;
  border-top: 3px solid #808080;
  border-left: 3px solid #808080;
  border-bottom: 3px solid #fff;
  border-right: 3px solid #fff;
  padding: 12px;
`;

const DigitsContainer = styled.div`
  background-color: #000;
  height: 35px;
  width: 60px;
  display: inline-block;
  white-space: nowrap;
  padding: 2px;
  display: flex;
  align-items: center;
`;

interface SmileProps {
  gameState: GameState;
}

const Smile = styled.div<SmileProps>`
  width: 40px;
  height: 40px;
  border-top: 4px solid #fff;
  border-left: 4px solid #fff;
  border-bottom: 5px solid #808080;
  border-right: 5px solid #808080;
  background: url('${(props) =>
    props.gameState === GameState.won
      ? face3
      : props.gameState === GameState.lost
      ? face4
      : face1}')no-repeat;
  background-size: 30px;
  background-position: center;
  &:active {
    border-top: 4px solid #808080;
    border-left: 4px solid #808080;
    border-bottom: 2px solid #808080;
    border-right: 2px solid #808080;
  }
`;

interface ScoreBoardProps {
  difficulty: Difficulty;
  flagsLeft: number;
  gameState: GameState;
  onNewGame: (difficulty: Difficulty) => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  difficulty,
  flagsLeft,
  gameState,
  onNewGame,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (gameState === GameState.started) {
      setSeconds(1);
    }
  }, [gameState]);

  useInterval(
    () => {
      setSeconds(seconds + 1);
    },
    gameState === GameState.started ? 1000 : null
  );

  function renderDigits(arr: string[]) {
    return arr.map((digit, index) => {
      return <Digit key={`D${index}`} digit={digit} />;
    });
  }

  function splitNumToDigits(num: number): string[] {
    if (num > 999) return ['9', '9', '9'];
    if (num < -99) return ['-', '9', '9'];
    const splitedNum = num.toString().split('');
    if (splitedNum.length < 3) {
      while (splitedNum.length !== 3) {
        splitedNum.unshift('0');
      }
    }
    if (splitedNum[1] === '-') {
      splitedNum[1] = '0';
      splitedNum[0] = '-';
    }
    return splitedNum;
  }

  function handleNewGameClick() {
    setSeconds(0);
    onNewGame(difficulty);
  }

  return (
    <StyledScoreBoard>
      <DigitsContainer>
        {renderDigits(splitNumToDigits(flagsLeft))}
      </DigitsContainer>
      <Smile onClick={handleNewGameClick} gameState={gameState} />
      <DigitsContainer>
        {renderDigits(splitNumToDigits(seconds))}
      </DigitsContainer>
    </StyledScoreBoard>
  );
};

export default ScoreBoard;
