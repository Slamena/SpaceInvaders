import { Actor } from "./actor";
import { Point } from "../types/Point";

export class FPSViewer extends Actor {
  constructor() {
    super({ x: 700, y: 35 });
  }
  // Se pinta un texto con los FPS
  draw(ctx: CanvasRenderingContext2D, delta: number) {
    //Cálculo de FPS
    const fps = (1 / delta).toFixed(0);
    //Indicar fuente y tamaño
    ctx.font = "35px Consolas";
    //Pintar FPS
    ctx.fillStyle = "#FFF";
    ctx.fillText(`FPS: ${fps}`, this.position.x, this.position.y);
  }
}
