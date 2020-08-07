import difficulties from '../difficulties';


export default class Game {
  difficulty: Object;

  flagsLeft: number;

  constructor(gameStarted: boolean = false,
    gameOver: boolean = false,
    gameWon: boolean = false) {

    this.difficulty = difficulties.Beginner;
    this.flagsLeft = difficulties.Beginner.minesQuantity;
  }
}
