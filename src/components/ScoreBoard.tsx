import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Smile from './Smile';
import useInterval from '../hooks/useInterval';

import face1 from '../images/face1.png';
import face2 from '../images/face2.png';
import face3 from '../images/face3.png';
import face4 from '../images/face4.png';
import Digit from './Digit';
import { Difficulty } from '../core/difficulties';
import { GameState, Face } from '../types';

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

const StyledImage = styled.img`
  width: 100%;
`;

interface ScoreBoardProps {
  difficulty: Difficulty;
  flagsLeft: number;
  gameState: GameState;
  onNewGame: (difficulty: Difficulty) => void;
  face: Face;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  difficulty,
  flagsLeft,
  gameState,
  onNewGame,
  face,
}) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (gameState === GameState.started) {
      setSeconds(1);
    }
    if (gameState === GameState.initial) {
      setSeconds(0);
    }
  }, [gameState]);

  useInterval(
    () => {
      setSeconds(seconds + 1);
    },
    gameState === GameState.started ? 1000 : null
  );

  function renderFlagsLeft(arr: string[]) {
    let key = 0;
    return arr.map((digit) => {
      return <Digit key={`D${key++}`} digit={digit} />;
    });
  }

  function renderTime(arr: string[]) {
    let key = 3;
    return arr.map((digit) => {
      return <Digit key={`D${key++}`} digit={digit} />;
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

  function renderSmile() {
    let src = '';

    switch (face) {
      case Face.oh:
        src = face2;
        break;
      case Face.won:
        src = face3;
        break;
      case Face.lost:
        src = face4;
        break;
      default:
        src = face1;
        break;
    }

    return (
      <Smile onNewGame={handleNewGameClick}>
        <StyledImage src={src} alt="" />
      </Smile>
    );
  }

  return (
    <StyledScoreBoard>
      <DigitsContainer>
        {renderFlagsLeft(splitNumToDigits(flagsLeft))}
      </DigitsContainer>
      {renderSmile()}
      <DigitsContainer>{renderTime(splitNumToDigits(seconds))}</DigitsContainer>
    </StyledScoreBoard>
  );
};

export default ScoreBoard;
