import { Point } from "../types/Point";
import { Actor } from "./Actor";

export class TextBanner extends Actor {
  text: string;
  constructor(text: string, pos: Point = { x: 0, y: 0 }) {
    super(pos);
    this.text = text;
  }

  draw(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";
    ctx.fillText(this.text, this.position.x, this.position.y);
    ctx.fill();
  }

  getname() {
    return "Banner";
  }
}
