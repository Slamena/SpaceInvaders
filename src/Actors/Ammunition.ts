import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { load_sprite } from "../utils/load_sprite";
import { abs, hypot } from "../utils/Math";
import { Actor } from "./actor";
import { Alien } from "./alien";

const SPRITES = [
  "/images/lasersprite1.png",
  "/images/lasersprite2.png",
  "/images/lasersprite3.png",
  "/images/lasersprite4.png",
];

// Load all sprites as individual frames to be rendered
const SPRITE_FRAMES = SPRITES.map(load_sprite);

// Sound effect shared with all ammunitions
const shootAudio = new Audio();
shootAudio.src = "/sounds/LaserShot.mp3";
shootAudio.volume = 0.3;


export class Ammunition extends Actor {
  hit: boolean;
  size: Size;
  frame: number;
  timer: number;

  constructor(pos: Point) {
    super(pos);
    this.hit = false;
    this.size = {
      w: 10,
      h: 60,
    };
    // Some animation data
    this.frame = 0;
    this.timer = 0;
    this.play();
  }

  update(delta: number): void {
    this.position = {
      x: this.position.x,
      y: (this.position.y -= 20),
    };
    this.frame = (this.frame + 1) % SPRITE_FRAMES.length;
    this.timer = Number((this.frame / 2).toFixed(0));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(SPRITE_FRAMES[this.frame], this.position.x, this.position.y);
  }

  laserHit(aliens: Alien[]): void {
    aliens.forEach((alien) => {
      let alienX = alien.position.x + alien.size.w / 2;
      let alienY = alien.position.y + alien.size.h / 2;
      let laserX = this.position.x + this.size.w / 2;
      let laserY = this.position.y + this.size.h / 2;
      let posX: number = abs(laserX - alienX);
      let posY: number = abs(laserY - alienY);

      let distance = hypot(posX, posY);
      let difDistance = alien.size.w / 2 + this.size.w / 2;
      if (distance <= difDistance) {
        this.hit = true;
        alien.death = true;
      }
    });
  }
  play():void {
    shootAudio.currentTime = 0;
    shootAudio.play();
  }
}