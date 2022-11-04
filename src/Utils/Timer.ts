import { Actor } from "../actors/actor";
import { Point } from "../types/Point";

export const startTimer = (ms: number) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve("Time");
      }, ms);
  });
};

export class Timer extends Actor {
  elapsed: number = 0;
  // Se pinta un texto con los FPS
  draw(ctx: CanvasRenderingContext2D) {
    //Cálculo de FPS
    this.elapsed = this.elapsed + (1/60);
    ctx.font = "35px Consolas";
    //Pintar FPS
    ctx.fillStyle = "#FFF";
    ctx.fillText(`Time: ${this.elapsed.toFixed(1)}s`, this.position.x, this.position.y);
  }
}

export const createGlobalTimer = () => new Timer({ x: 20, y: 30 });