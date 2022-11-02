import { Actor } from "../Actors/Actor";

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
    ctx.fillStyle = "#000";
    ctx.fillText(`Time: ${this.elapsed.toFixed(1)}s`, this.position.x, this.position.y);
  }
}