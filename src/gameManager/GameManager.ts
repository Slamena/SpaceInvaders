import { Alien } from "../actors/Alien";
import { createPlayer, SpaceShip } from "../actors/Spaceship";
import { randomeNum } from "../utils/Math";
import { createGlobalTimer, Timer } from "../utils/Timer";

export class GameManager {
    player: SpaceShip;
    aliens: Alien[];
    timer: Timer;
    aliensSpeed: number;

    constructor(){
        this.player = createPlayer({ x: 700, y: 1350 });
        this.aliens = [];
        this.timer = createGlobalTimer();
        this.aliensSpeed = 2;
    }

    update(): void {
        this.player.update(0);
        this.aliens.forEach((alien) => alien.update(0));

        let additionalSpeed: number = Number((this.timer.elapsed / 10).toFixed(0));
        console.log(additionalSpeed);
        this.aliensSpeed = additionalSpeed + 2;

        this.player.ammu.forEach((muni) => {
        muni.laserHit(this.aliens);
        })
    }

    draw(ctx: CanvasRenderingContext2D):void {
        this.player.draw(ctx);
        this.aliens.forEach((alien) => alien.draw(ctx));
        this.timer.draw(ctx);
    }

    startGame(): void {
        this.player = createPlayer({ x: 700, y: 1350 });
        this.timer = createGlobalTimer();
        this.aliens = [];
    };

    createAliens(ms: number) {
        setInterval(() => {
            let alienPos = {
                x: randomeNum(1000) + 250,
                y: -50
            }
            this.aliens.push(new Alien(alienPos, this.aliensSpeed));
        }, ms);
    }

    keyboardEventDown(key: string):void {
        this.player.keyboardEventDown(key);
    }

    keyboardEventUp(key: string):void {
        this.player.keyboardEventUp(key);
    }

    laserHit():void {
        this.player.ammu.forEach((muni) => {
            muni.laserHit(this.aliens);
            if (muni.hit) {
                this.player.updateScore(true);
                muni.hit = false;
                muni.position = {x:1500, y:1500};
            }
        })
    }

    collisionDetecto():void {
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
        })
    }

    checkLifes():void {
        if(this.player.lifes===0){
            this.startGame();
        }
    }

    checkScore():void {
        if(this.player.score < 0){
            this.startGame();
        }
    }

    score():string {
        return this.player.score.toString();
    }
}

export let gameManager: GameManager;