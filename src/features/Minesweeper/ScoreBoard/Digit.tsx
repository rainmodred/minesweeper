import React from 'react';
import styles from './ScoreBoard.module.css';

// Seven segment digit https://codepen.io/joeyred/pen/gEpVbM
// |--2--|
// 0     5
// |--3--|
// 1     6
// |--4--|

type Segments = {
  [key: string]: boolean[];
};

function numberToSSD(key: string) {
  const segments: Segments = {
    '0': [true, true, true, false, true, true, true],
    '1': [false, false, false, false, false, true, true],
    '2': [false, true, true, true, true, true, false],
    '3': [false, false, true, true, true, true, true],
    '4': [true, false, false, true, false, true, true],
    '5': [true, false, true, true, true, false, true],
    '6': [true, true, true, true, true, false, true],
    '7': [false, false, true, false, false, true, true],
    '8': [true, true, true, true, true, true, true],
    '9': [true, false, true, true, true, true, true],
    '-': [false, false, false, true, false, false, false],
  };
  return segments[key];
}

interface DigitProps {
  digit: string;
}

const Digit: React.FC<DigitProps> = ({ digit }) => {
  const displayStates = numberToSSD(digit.toString());

  const segments = [
    displayStates[0] ? (
      <polygon
        id="v_top-left"
        points="3,4.6 0,9.6 0,39.4 3,44.4 6.1,39.4 6.1,9.6"
      />
    ) : (
      <polygon
        id="v_top-left"
        points="3,4.6 0,9.6 0,39.4 3,44.4 6.1,39.4 6.1,9.6"
        fill="#141414"
      />
    ),
    displayStates[1] ? (
      <polygon
        id="v_bottom-left"
        points="3,48.1 0,53.1 0,82.8 3,87.8 6.1,82.8 6.1,53.1"
      />
    ) : (
      <polygon
        id="v_bottom-left"
        points="3,48.1 0,53.1 0,82.8 3,87.8 6.1,82.8 6.1,53.1"
        fill="#141414"
      />
    ),
    displayStates[2] ? (
      <polygon
        id="h_top"
        points="4.8,3 9.8, 6.1 39.5, 6.1 44.5, 3 39.5,0 9.8,0"
      />
    ) : (
      <polygon
        id="h_top"
        points="4.8,3 9.8,6.1 39.5,6.1 44.5,3 39.5,0 9.8,0"
        fill="#141414"
      />
    ),
    displayStates[3] ? (
      <polygon
        id="h_middle"
        points="4.8,46.2 9.8,49.3 39.5,49.3 44.5,46.2 39.5,43.2 9.8,43.2"
      />
    ) : (
      <polygon
        id="h_middle"
        points="4.8,46.2 9.8,49.3 39.5,49.3 44.5,46.2 39.5,43.2 9.8,43.2"
        fill="#141414"
      />
    ),
    displayStates[4] ? (
      <polygon
        id="h_bottom"
        points="4.8,89.7 9.8,92.7 39.5,92.7 44.5,89.7 39.5,86.6 9.8,86.6"
      />
    ) : (
      <polygon
        id="h_bottom"
        points="4.8,89.7 9.8,92.7 39.5,92.7 44.5,89.7 39.5,86.6 9.8,86.6"
        fill="#141414"
      />
    ),
    displayStates[5] ? (
      <polygon
        id="v_top-right"
        points="46.3,4.6 49.3,9.6 49.3,39.4 46.3,44.4 43.2,39.4 43.2,9.6"
      />
    ) : (
      <polygon
        id="v_top-right"
        points="46.3,4.6 49.3,9.6 49.3,39.4 46.3,44.4 43.2,39.4 43.2,9.6 "
        fill="#141414"
      />
    ),
    displayStates[6] ? (
      <polygon
        id="v_bottom-right"
        points="46.3,48.1 49.3,53.1 49.3,82.8 46.3,87.8 43.2,82.8 43.2,53.1"
      />
    ) : (
      <polygon
        id="v_bottom-right"
        points="46.3,48.1 49.3,53.1 49.3,82.8 46.3,87.8 43.2,82.8 43.2,53.1"
        fill="#141414"
      />
    ),
  ];
  return (
    <div className={styles.digit}>
      <svg viewBox="0 0 49.3 92.7" preserveAspectRatio="xMidYMid meet">
        {...segments}
      </svg>
    </div>
  );
};

export default Digit;
