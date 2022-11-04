import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { checkXLimits } from "../utils/checkLimits";
import { load_sprite } from "../utils/load_sprite";
import { startTimer } from "../utils/Timer";
import { Actor } from "./actor";
import { Ammunition } from "./ammunition";

const SPACESHIP_SPRITE = {
  BASE: load_sprite("/images/spaceship.png"),
  LEFT: load_sprite("/images/spaceshipleft.png"),
  RIGHT: load_sprite("/images/spaceshipright.png"),
};

export class SpaceShip extends Actor {
  reloading: boolean;
  ammu: Ammunition[];
  size: Size;
  maxMuni: number;
  score: number;
  lifes: number;
  sprite: HTMLImageElement;
  acceleration: number = 0;
  buttons = {
    left: false,
    right: false,
    shoot: false,
  };
  cd: boolean = false;

  constructor(props: Point) {
    super(props);
    this.size = {
      w: 100,
      h: 100,
    };
    this.reloading = false;
    this.speed = 0;
    this.ammu = [];
    this.score = 0;
    this.lifes = 3;
    this.maxMuni = 25;
    this.sprite = SPACESHIP_SPRITE.BASE;
  }

  update(delta: number): void {
    // Shoot
    if (this.buttons.shoot) {
      this.buttons.shoot = false;
      if(!this.cd){
        this.shoot();
        this.cd = true;
        setTimeout(() => {
          this.cd = false;
        }, 150);
      }
    }

    let accelerate = 0;
    // Calculate acceleration
    if (this.buttons.right) {
      accelerate += 2;
    }
    if (this.buttons.left) {
      accelerate -= 2;
    }
    this.acceleration = accelerate;

    //this.acceleration = this.acceleration * 0.98;
    this.speed = (this.speed + this.acceleration) * 0.95;

    const newPos = {
      x: this.position.x + this.speed,
      y: this.position.y,
    };
    if (checkXLimits(newPos)) {
      this.position = newPos;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";
    ctx.drawImage(this.sprite, this.position.x, this.position.y);

    this.ammu.forEach((laser) => {
      laser.update(0);
      laser.draw(ctx);
    });
    if (this.reloading) {
      ctx.fillText(
        "Reloading",
        this.position.x - 30,
        this.position.y + this.size.h + 30
      );
    }
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";
    ctx.fillText(`Lifes: ${this.lifes}`, 1320, 30);
  }

  keyboardEventDown(key: string): void {
    switch (key) {
      case "d":
        this.buttons.right = true;
        this.sprite = SPACESHIP_SPRITE.RIGHT;
        break;
      case "a":
        this.buttons.left = true;
        this.sprite = SPACESHIP_SPRITE.LEFT;
        break;
      case " ":
        this.buttons.shoot = true;
        break;
    }
  }

  keyboardEventUp(key: string): void {
    switch (key) {
      case "d":
        this.buttons.right = false;
        this.sprite = SPACESHIP_SPRITE.BASE;
        break;
      case "a":
        this.buttons.left = false;
        this.sprite = SPACESHIP_SPRITE.BASE;
        break;
    }
  }

  shoot(): void {
    if (this.maxMuni - this.ammu.length > 0) {
      let ammuPos = {
        x: this.position.x + this.size.w / 2 - 10,
        y: this.position.y,
      };
      this.ammu.push(new Ammunition(ammuPos));
    } else {
      if (!this.reloading) {
        startTimer(1500).then(() => {
          this.ammu = [];
          this.reloading = false;
        });
        this.reloading = true;
      }
    }
  }

  updateScore(score: boolean): void {
    if (score) {
      this.score += 50;
    } else {
      this.score -= 500;
    }
  }

  checkLifes(): boolean {
    if (this.lifes === 0) {
      this.position = { x: 700, y: 1350 };
      this.reloading = false;
      this.acceleration = 0;
      this.ammu = [];
      this.score = 0;
      this.lifes = 3;
      this.maxMuni = 25;
      return true;
    }
    return false;
  }
}

export const createPlayer = (pos: Point) => new SpaceShip(pos);
