import Swal from "sweetalert2";
import { Actor } from "./actors/actor";
import { Alien } from "./actors/alien";
import { createPlayer, SpaceShip } from "./actors/spaceship";
import { randomeNum } from "./utils/Math";
import { createGlobalTimer, Timer } from "./utils/Timer";

export class GameManager extends Actor {
  player: SpaceShip;
  aliens: Alien[];
  timer: Timer;
  aliensSpeed: number;
  startNewGame: boolean;
  gameRunning: boolean;

  constructor() {
    super({ x: 0, y: 0 })
    this.player = createPlayer({ x: 700, y: 1350 });
    this.aliens = [];
    this.timer = createGlobalTimer();
    this.aliensSpeed = 2;
    this.startNewGame = false;
    this.gameRunning = false;
  }

  update(delta: number): void {
    if (this.gameRunning) {
      this.player.update(0);
      this.aliens.forEach((alien) => alien.update(0));

      // Additional speed for the aliens. "1" speed each 10 seconds in the game.
      let additionalSpeed: number = Number((this.timer.elapsed / 10).toFixed(0));
      this.aliensSpeed = additionalSpeed + 2;

      this.player.ammu.forEach((muni) => {
        muni.laserHit(this.aliens);
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D, delta?: number): void {
    if (this.gameRunning) {
      this.player.draw(ctx);
      this.aliens.forEach((alien) => alien.draw(ctx));
      this.timer.draw(ctx);
    }

  }

  startGame(ctx: CanvasRenderingContext2D): void {
    if (this.gameRunning) {
      this.resetGame();
    } else {
      ctx.font = "35px Consolas";
      ctx.fillStyle = "#FFF";
      ctx.fillText("Press Enter to start.", 600, 720);
      ctx.fill();
    }

  }

  resetGame(): void{
    this.player = createPlayer({ x: 700, y: 1350 });
    this.timer = createGlobalTimer();
    this.aliens = [];
    this.aliensSpeed = 2;
  }

  createAliens(ms: number) {
    let timer = setInterval(() => {
      if(!this.gameRunning){
        clearInterval(timer);
      }
      let alienPos = {
        x: randomeNum(1000) + 250,
        y: -50,
      };
      this.aliens.push(new Alien(alienPos, this.aliensSpeed));
    }, ms);
  }

  keyboardEventDown(key: string): void {
    if (key === "Enter" && !this.gameRunning) {
      this.createAliens(1000);
      this.gameRunning = true;
    }
      this.player.keyboardEventDown(key);
  }

  keyboardEventUp(key: string): void {
    this.player.keyboardEventUp(key);
  }

  laserHit(): void {
    this.player.ammu.forEach((muni) => {
      muni.laserHit(this.aliens);
      if (muni.hit) {
        this.player.updateScore(true);
        muni.hit = false;
        muni.position = { x: 1500, y: 1500 };
      }
    });
  }

  collisionDetecter(): void {
    this.aliens.forEach((alien) => {
      if (alien.collisionDetector(this.player)) {
        this.player.lifes -= 1;
        alien.deathSound();
      }
      if (alien.checkDeath()) {
        this.aliens = this.aliens.filter((e) => e !== alien);
        alien.deathSound();
      }
      if (alien.checkOutLimits()) {
        this.aliens = this.aliens.filter((e) => e !== alien);
        this.player.updateScore(false);
      }
    });
  }

  checkLifesEqualZero(): boolean {
    let validation = false;
    (this.player.lifes <= 0) ? validation = true : validation = false;
    return validation;
  }

  checkScoreEqualZero(): boolean {
    let validation = false;
    (this.player.score < 0) ? validation = true : validation = false;
    return validation;
  }

  score(): string {
    return this.player.score.toString();
  }

  lose(ctx: CanvasRenderingContext2D): void {
    if (this.checkLifesEqualZero() || this.checkScoreEqualZero()) {
      Swal.fire('Game Over');
      this.startGame(ctx);
      this.gameRunning = false;
    }
  }

}

export let gameManager: GameManager;
