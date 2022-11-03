import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { abs, hypot } from "../utils/Math";
import { Actor } from "./Actor";
import { Alien } from "./Alien";

const SPRITES = ["./src/assets/images/LaserSprite1.png", "./src/assets/images/LaserSprite2.png", "./src/assets/images/LaserSprite3.png", "./src/assets/images/LaserSprite4.png"];

export class Ammunition extends Actor {
    hit: boolean;
    size: Size;
    sprite: HTMLImageElement;
    frame: number;
    timer: number;
    shootAudio: HTMLAudioElement;

    constructor(pos: Point) {
        super(pos);
        this.hit = false;
        this.size = {
            w: 10,
            h: 60
        }
        this.sprite = new Image();
        this.sprite.src = SPRITES[0];
        this.frame = 0;
        this.timer = 0;
        this.shootAudio = new Audio();
        this.shootAudio.src = "./src/assets/sounds/LaserShot.mp3"
        this.shootAudio.volume = 0.3;
        this.shootAudio.play();
    }

    update(delta: number): void {
        this.position = {
            x: this.position.x,
            y: this.position.y -= 20
        }
        this.frame += 1;
        this.timer = Number((this.frame/2).toFixed(0));
        this.sprite.src = SPRITES[this.timer%4];
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite, this.position.x, this.position.y)

    }

    laserHit(aliens: Alien[]): void {
        aliens.forEach((alien) => {
            let alienX = alien.position.x + (alien.size.w / 2);
            let alienY = alien.position.y + (alien.size.h / 2);
            let laserX = this.position.x + (this.size.w / 2);
            let laserY = this.position.y + (this.size.h / 2);
            let posX: number = abs(laserX - alienX);
            let posY: number = abs(laserY - alienY);

            let distance = hypot(posX, posY);
            let difDistance = alien.size.w / 2 + this.size.w / 2
            if (distance <= difDistance) {
                this.hit = true;
                alien.death = true;
            }
        })
    }
}