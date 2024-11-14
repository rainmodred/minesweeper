import { Difficulties } from './types';

export const difficulties: Difficulties = {
  Beginner: {
    name: 'Beginner',
    width: 9,
    height: 9,
    minesCount: 10,
  },
  Intermediate: {
    name: 'Intermediate',
    width: 16,
    height: 16,
    minesCount: 40,
  },
  Expert: {
    name: 'Expert',
    width: 30,
    height: 16,
    minesCount: 99,
  },
};
