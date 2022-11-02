import { Point } from "../Types/Point";
import { Size } from "../Types/Size";
import { abs, hypot } from "../Utils/Math";
import { Actor } from "./Actor";
import { Alien } from "./Alien";

export class Ammunition extends Actor{
    hit: boolean;
    size: Size;

    constructor(pos: Point){
        super(pos);
        this.hit = false;
        this.size = {
            w: 20,
            h: 20
        }
    }

    update(delta: number): void {
        this.position = {
            x: this.position.x,
            y: this.position.y-=20
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, (this.position.y), this.size.w, this.size.h);
        
    }

    laserHit(aliens: Alien[]): void{
        aliens.forEach((alien) => {
            let alienX = alien.position.x+(alien.size.w/2);
            let alienY = alien.position.y+(alien.size.h/2);
            let laserX = this.position.x+(this.size.w/2);
            let laserY = this.position.y+(this.size.h/2);
            let posX:number = abs(laserX-alienX);
            let posY:number = abs(laserY-alienY);
            
            let distance = hypot(posX,posY);
            let difDistance = alien.size.w/2+this.size.w/2
            if(distance<= difDistance){
                this.hit = true;
                alien.death = true;
            }
        })
    }
}