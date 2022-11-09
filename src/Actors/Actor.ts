import { Point } from "../types/Point";
import { Size } from "../types/Size";

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
  size: Size = { w: 0, h: 0 };
  to_delete: boolean = false;
  constructor(position: Point) {
    this.position = position;
    this.speed = 10;
  }

  getname() {
    return "Actor";
  }
  update(delta: number) {}
  draw(ctx: CanvasRenderingContext2D, delta: number) {}
  keyboardEventDown(key: string) {}
  keyboardEventUp(key: string) {}
}
