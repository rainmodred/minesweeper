export enum Options {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export type Difficulties = {
  [key in Options]: Difficulty;
};

export type Difficulty = {
  width: number;
  height: number;
  minesCount: number;
};

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
