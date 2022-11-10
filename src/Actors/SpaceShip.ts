import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { checkXLimits } from "../utils/checkLimits";
import { load_sprite } from "../utils/load_sprite";
import { startTimer } from "./Timer";
import { Actor } from "./Actor";
import { Ammunition } from "./Ammunition";
import { Alien } from "./Alien";
import { abs, hypot } from "../utils/Math";
import { Manager } from "./ActorManager";

const SPACESHIP_SPRITE = {
  BASE: load_sprite("/images/spaceship.png"),
  LEFT: load_sprite("/images/spaceshipleft.png"),
  RIGHT: load_sprite("/images/spaceshipright.png"),
};

export class SpaceShip extends Actor {
  reloading: boolean;
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
    this.score = 0;
    this.lifes = 3;
    this.maxMuni = 25;
    this.sprite = SPACESHIP_SPRITE.BASE;
  }

  getname() {
    return "Spaceship";
  }

  update(delta: number): void {
    // Shoot
    if (this.buttons.shoot) {
      this.buttons.shoot = false;
      if (!this.cd) {
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

    if (this.reloading) {
      ctx.fillText(
        "Reloading",
        this.position.x - 30,
        this.position.y + this.size.h + 30
      );
    }
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";
    ctx.fillText(`Lifes: ${this.lifes}`, 1300, 30);
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";
    ctx.fillText(`Score: ${this.score}`, 1300, 60);
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
    const bala = new Ammunition(this);
    Manager.add_actor(bala);
  }

  actorIntersectsWithPlayerAmmunition(a: Alien) {
    let alienX = a.position.x + a.size.w / 2;
    let alienY = a.position.y + a.size.h / 2;
    let laserX = this.position.x + this.size.w / 2;
    let laserY = this.position.y + this.size.h / 2;
    let posX: number = abs(laserX - alienX);
    let posY: number = abs(laserY - alienY);

    let distance = hypot(posX, posY);
    let difDistance = a.size.w / 2 + this.size.w / 2;
    return distance <= difDistance;
  }
}
