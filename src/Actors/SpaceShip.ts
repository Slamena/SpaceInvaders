import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { checkXLimits} from "../utils/checkLimits";
import { startTimer } from "../utils/Timer";
import { Actor } from "./Actor";
import { Ammunition } from "./Ammunition";

const SPRITE = "./src/assets/images/SpaceShip.png";
const LEFT_SPRITE = "./src/assets/images/SpaceShipLeft.png";
const RIGHT_SPRITE = "./src/assets/images/SpaceShipRight.png";

export class SpaceShip extends Actor {
    reloading: boolean;
    ammu: Ammunition[];
    size: Size;
    maxMuni: number;
    score: number;
    lifes: number;
    sprite: HTMLImageElement;
    

    constructor(props: Point) {
        super(props);
        this.size = {
            w: 100,
            h: 100
        }
        this.reloading = false;
        this.speed = 0;
        this.ammu = [];
        this.score = 0;
        this.lifes = 3;
        this.maxMuni = 25;
        this.sprite = new Image();
        this.sprite.src = SPRITE;
        
    }

    update(delta: number): void { 
         
        const newPos = {
            x: this.position.x+(this.speed),
            y: this.position.y
        }
        if(checkXLimits(newPos)){
            this.position = newPos;
        }else{
            this.speed = 0;
        }
        let image = new Image();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite,this.position.x, this.position.y);
        
        this.ammu.forEach((laser) => {
            ctx.save();
            laser.update(0);
            laser.draw(ctx);
            ctx.restore();
        })
        if(this.reloading){
            ctx.font = "35px Consolas";
            ctx.fillStyle = "#FFF";
            ctx.fillText("Reloading", this.position.x-30, this.position.y+(this.size.h)+30);
        }
        ctx.fillStyle = "#FFF";
        ctx.fillText(`Lifes: ${this.lifes}`, 1320, 30);
    }

    keyboardEventDown(key: string): void {
        switch (key) {
            case "d":
                this.speed = 10;
                this.sprite.src = RIGHT_SPRITE;
                break;
            case "a":
                this.speed = -10;
                this.sprite.src = LEFT_SPRITE;
                break;
            case " ":
                this.shoot();
                break;
        }
    }

    keyboardEventUp(key: string): void { 
        switch (key) {
            case "d":
                this.speed = 0;
                this.sprite.src = SPRITE;
                break;
            case "a":
                this.speed = 0;
                this.sprite.src = SPRITE;
                break;
        }
    }

    shoot():void {
        if(this.maxMuni-this.ammu.length > 0){
            let ammuPos = {
                x: this.position.x+(this.size.w/2)-10,
                y: this.position.y
            }
            this.ammu.push(new Ammunition(ammuPos));
        }else{
            if(!this.reloading){
                startTimer(1500).then(() => {
                    this.ammu = [];
                    this.reloading = false;
                });
                this.reloading = true;
            }
        }
    }

    updateScore(score: boolean): void {
        if(score){
            this.score += 50;
        }else{
            this.score -= 500;
        }
        
    }

    checkLifes():boolean {
        if(this.lifes===0){
            this.position = { x: 700, y: 1350 };
            this.reloading = false;
            this.speed = 0;
            this.ammu = [];
            this.score = 0;
            this.lifes = 3;
            this.maxMuni = 25;
            return true;
        }
        return false;
    }
}
