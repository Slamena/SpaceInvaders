import { Point } from "../types/Point"

interface ActorInterface {
    position: Point;
    speed: number;
    update: (delta: number) => void;
    draw: (ctx: CanvasRenderingContext2D, delta: number) => void;
    keyboardEventDown: (key: string) => void;
    keyboardEventUp: (key: string) => void;
}

export class Actor implements ActorInterface {
    position: Point;
    speed: number;
    constructor(position: Point) {
        this.position = position;
        this.speed = 10;
    }

    update(delta: number) {}
    draw(ctx: CanvasRenderingContext2D, delta: number) {}
    keyboardEventDown(key: string) {}
    keyboardEventUp(key: string) {}
}