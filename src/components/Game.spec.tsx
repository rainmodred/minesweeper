import { fireEvent, render, screen } from '@testing-library/react';
import { createGameboard, Game } from '../App';
import { difficulties } from '../game/difficulties';

function Meow() {
  return Math.random();
}

describe('Game', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.4)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.8)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.9);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('lost', () => {
    render(<Game difficulty={difficulties['Beginner']} />);

    let gameboard = screen.getByTestId('gameboard');

    fireEvent.click(screen.getByTestId('0:1'));
    fireEvent.click(screen.getByTestId('0:0'));

    screen.debug(gameboard);

    // let cell = screen.getByTestId('0:0');
    // fireEvent.click(cell);
    // screen.debug(cell);

    // screen.debug(screen.getByTestId('c0:0'));
  });
});
