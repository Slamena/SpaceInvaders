import { Point } from "../types/Point"
import { Size } from "../types/Size";
import { checkYLimits } from "../utils/checkLimits";
import { load_sprite } from "../utils/load_sprite";
import { abs, hypot } from "../utils/Math";
import { Actor } from "./actor";
import { SpaceShip } from "./spaceship";

const SPRITE = load_sprite("/images/alienSprites/Alien.png");

const explosion = new Audio();
explosion.src = "/sounds/Explosion.mp3"
explosion.volume = 0.3;

export  class Alien extends Actor {
    death: boolean;
    size: Size;
    sprite: HTMLImageElement;
    
    constructor(props: Point, speed: number){
        super(props);
        this.speed = speed;
        this.death = false;
        this.size = {
            w: 100,
            h: 100
        }
        this.sprite = SPRITE;
    }

    update(delta: number): void {
        const newPos = {
            x: this.position.x,
            y: this.position.y+(this.speed)
        }
        
        this.position = newPos;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite,this.position.x, this.position.y);
    }

    checkDeath(): boolean{
        if(this.death === true){
            return true;
        }
        return false;
    }

    checkOutLimits(): boolean{
        if(checkYLimits(this.position)){
            return false;
        }
        return true;
    }

    collisionDetector(player: SpaceShip): boolean {
        let playerPosX: number = player.position.x+(player.size.w/2);
        let playerPosY: number = player.position.y+(player.size.h/2);
        let alienX = this.position.x+(this.size.w/2);
        let alienY = this.position.y+(this.size.h/2);
        let posX:number = abs(alienX-playerPosX);
        let posY:number = abs(alienY-playerPosY);
        
        let distance = hypot(posX,posY);
        let difDistance = player.size.w/2+this.size.w/2
        if(distance<= difDistance){
            this.death = true;
            return true;
        }
        return false;
    }

    deathSound():void {
        explosion.currentTime = 0;
        explosion.play();
    }
}

export const createAlien = (pos: Point, speed: number) => new Alien(pos, speed);