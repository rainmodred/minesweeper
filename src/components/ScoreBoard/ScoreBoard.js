import React, { Component } from 'react';
import styled from 'styled-components';

import Digit from '../Digit/Digit';
import face1 from '../../assets/face1.png';
import face3 from '../../assets/face3.png';
import face4 from '../../assets/face4.png';

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

const Smile = styled.div`
  width: 40px;
  height: 40px;
  border-top: 4px solid #fff;
  border-left: 4px solid #fff;
  border-bottom: 5px solid #808080;
  border-right: 5px solid #808080;
  background: url('${props => (props.gameWon ? face3 : props.gameOver ? face4 : face1)}')no-repeat;
  background-size: 30px;
  background-position: center;
  &:active {
    border-top: 4px solid #808080;
    border-left: 4px solid #808080;  
    border-bottom: 2px solid #808080;
    border-right: 2px solid #808080;
  }
`;

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      isOn: false,
    };
    this.id = 0;
  }

  startTimer = () => {
    this.interval = setInterval(
      () =>
        this.setState(prevState => {
          return prevState.seconds++;
        }),
      1000
    );
  };
  componentDidUpdate() {
    const { gameStarted, gameOver, gameWon } = this.props;
    const { isOn } = this.state;

    if (!gameStarted && !gameOver && !gameWon && isOn) {
      clearInterval(this.interval);
      this.setState({ seconds: 0, isOn: false });
    }
    if (gameStarted && !isOn) {
      this.setState({
        isOn: !isOn,
      });

      clearInterval(this.interval);
      this.startTimer();
    }
    if (gameOver || gameWon) {
      clearInterval(this.interval);
    }
  }
  componentWillMount() {
    clearInterval(this.interval);
  }
  splitNumToDigits(num) {
    if (num > 999) return [9, 9, 9];
    if (num < -99) return ['-', 9, 9];
    const splitedNum = num.toString().split('');
    if (splitedNum.length < 3) {
      while (splitedNum.length !== 3) {
        splitedNum.unshift(0);
      }
    }
    if (splitedNum[1] === '-') {
      splitedNum[1] = 0;
      splitedNum[0] = '-';
    }
    return splitedNum;
  }

  renderDigits = arr => {
    //fix keys
    return arr.map(digit => {
      this.id++;
      return <Digit key={this.id} digit={digit} />;
    });
  };

  handleNewGameClick = () => {
    const { newGameClick, difficulty } = this.props;
    clearInterval(this.interval);
    this.setState({ seconds: 0, isOn: false });
    newGameClick(difficulty);
  };

  render() {
    const { flagsLeft, gameOver, gameWon } = this.props;
    const { seconds } = this.state;
    const { splitNumToDigits, renderDigits, handleNewGameClick } = this;

    return (
      <StyledScoreBoard>
        <DigitsContainer>{renderDigits(splitNumToDigits(flagsLeft))}</DigitsContainer>
        <Smile onClick={handleNewGameClick} gameOver={gameOver} gameWon={gameWon} />
        <DigitsContainer>{renderDigits(splitNumToDigits(seconds))}</DigitsContainer>
      </StyledScoreBoard>
    );
  }
}

export default ScoreBoard;
