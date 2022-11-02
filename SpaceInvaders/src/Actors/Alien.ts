import { Point } from "../Types/Point"
import { Size } from "../Types/Size";
import { checkYLimits } from "../Utils/checkLimits";
import { abs, hypot } from "../Utils/Math";
import { Actor } from "./Actor";
import { SpaceShip } from "./SpaceShip";


export  class Alien extends Actor {
    death: boolean;
    size: Size;
    
    constructor(props: Point){
        super(props);
        this.speed = 2;
        this.death = false;
        this.size = {
            w: 100,
            h: 100
        }
    }

    update(delta: number): void {
        const newPos = {
            x: this.position.x,
            y: this.position.y+(this.speed)
        }
        
        this.position = newPos;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "black";
        ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h);
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
}