import { Point } from "../types/Point";
import { checkYLimits } from "../utils/checkLimits";
import { load_sprite } from "../utils/load_sprite";
import { abs, hypot } from "../utils/Math";
import { Actor } from "./Actor";
import { SpaceShip } from "./SpaceShip";

const SPRITE = load_sprite("/images/alienSprites/Alien.png");

const explosion = new Audio();
explosion.src = "/sounds/Explosion.mp3";
explosion.volume = 0.3;

export class Alien extends Actor {
  sprite: HTMLImageElement;
  player: SpaceShip;
  alien_id?: string;

  constructor(props: Point, speed: number, player: SpaceShip) {
    super(props);
    console.log("New Alien");
    this.speed = speed;
    this.size = {
      w: 100,
      h: 100,
    };
    this.sprite = SPRITE;
    this.player = player;
    this.alien_id = Math.floor(Math.random() * 1000).toFixed(0);
  }

  getname() {
    return `Alien-${this.alien_id}`;
  }

  update(delta: number): void {
    const newPos = {
      x: this.position.x,
      y: this.position.y + this.speed,
    };

    this.position = newPos;
    if (this.collisionWithPlayer() && !this.to_delete) {
      // Death with sound and score change on player
      this.player.lifes -= 1;
      this.deathSound();
      this.to_delete = true;
      return;
    }

    if (this.player.actorIntersectsWithPlayerAmmunition(this)) {
      // The current alien interesects with playuer amunition
      this.player.score += 1;
      this.deathSound();
      this.to_delete = true;
    }

    if (this.checkOutLimits()) {
      // death without sound because we are out of Y axis limits
      this.to_delete = true;
      this.player.score -= 1;
      return;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.sprite, this.position.x, this.position.y);
  }

  // checkDeath(): boolean {
  //   if (this.death === true) {
  //     return true;
  //   }
  //   return false;
  // }

  checkOutLimits(): boolean {
    if (checkYLimits(this.position)) {
      return false;
    }
    return true;
  }

  collisionWithPlayer(): boolean {
    let playerPosX: number = this.player.position.x + this.player.size.w / 2;
    let playerPosY: number = this.player.position.y + this.player.size.h / 2;
    let alienX = this.position.x + this.size.w / 2;
    let alienY = this.position.y + this.size.h / 2;
    let posX: number = abs(alienX - playerPosX);
    let posY: number = abs(alienY - playerPosY);

    let distance = hypot(posX, posY);
    let difDistance = this.player.size.w / 2 + this.size.w / 2;
    if (distance <= difDistance) {
      //this.death = true;
      return true;
    }
    return false;
  }

  deathSound(): void {
    explosion.currentTime = 0;
    explosion.play();
  }
}
