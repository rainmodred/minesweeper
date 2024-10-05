import { Difficulties } from './types';

export const difficulties: Difficulties = {
  Beginner: {
    width: 9,
    height: 9,
    minesCount: 10,
  },
  Intermediate: {
    width: 16,
    height: 16,
    minesCount: 40,
  },
  Expert: {
    width: 30,
    height: 16,
    minesCount: 99,
  },
};
