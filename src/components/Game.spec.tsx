import { fireEvent, render, screen } from '@testing-library/react';
import Game from './Game';

describe('Game', () => {
  it('renders', () => {
    render(<Game />);

    let gameboard = screen.getByTestId('gameboard');

    screen.debug(gameboard);

    let cell = screen.getByTestId('0:0');
    fireEvent.click(cell);
    screen.debug(cell);

    // screen.debug(screen.getByTestId('c0:0'));
  });
});
