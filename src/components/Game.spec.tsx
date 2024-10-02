import { fireEvent, render, screen } from '@testing-library/react';
import { createGameboard, Game } from '../App';
import { difficulties } from '../game/difficulties';

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

  it('won', () => {
    render(<Game difficulty={{ width: 9, height: 9, minesCount: 2 }} />);

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.contextMenu(screen.getByTestId('0:0'));
    fireEvent.contextMenu(screen.getByTestId('1:1'));
    fireEvent.click(screen.getByTestId('0:1'));
    fireEvent.click(screen.getByTestId('1:0'));
    fireEvent.click(screen.getByTestId('3:3'));

    expect(smile).toHaveAttribute('data-gamestate', 'won');
  });

  it.skip('lost', () => {
    const difficulty = difficulties['Beginner'];
    render(<Game difficulty={difficulty} />);

    const gameboard = screen.getByTestId('gameboard');

    const smile = screen.getByTestId('smile');
    expect(smile).toHaveAttribute('data-gamestate', 'idle');

    fireEvent.click(screen.getByTestId('0:1'));
    expect(smile).toHaveAttribute('data-gamestate', 'started');

    fireEvent.click(screen.getByTestId('0:0'));
    expect(smile).toHaveAttribute('data-gamestate', 'lost');

    const expectedMines = gameboard.querySelectorAll(
      '.cell[data-mine="true"]'
    ).length;

    expect(expectedMines).toBe(difficulty.minesCount);

    fireEvent.click(smile);
    expect(smile).toHaveAttribute('data-gamestate', 'idle');
  });
  it.todo('safe first click');
  it.todo('timer');
  it.todo('flags');
});
