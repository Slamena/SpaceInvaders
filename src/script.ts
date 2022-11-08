import { Actor } from "./actors/actor";
import { FPSViewer } from "./actors/fpsviewer";
import { GameManager } from "./GameManager";

const root_element: HTMLElement | any = document.getElementById("root");
let score = document.createElement("p");
root_element.append(score);
const INITIAL_SPEED = 2;

window.onload = () => {
  //Obtetner el canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  //Darle un contexto al canvas
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  let gameManager = new GameManager();

  let fpsViewer = new FPSViewer();

  let actors: Actor[] = [
    gameManager,
    fpsViewer
  ];
  //Parte del renderizado
  let lastFrame = 0;
  gameManager.startGame(ctx);
  const render = (time: number) => {
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;
    actors.forEach((actor) => actor.update(delta));


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    actors.forEach((actor) => actor.draw(ctx,delta));
    ctx.restore();

    gameManager.laserHit();
    gameManager.collisionDetecter();
    gameManager.lose(ctx);
    score.innerHTML = "Score: " + gameManager.score() + " points";

    // Método Recursivo
    window.requestAnimationFrame(render);
  };

  //Permite renderizar
  window.requestAnimationFrame(render);

  document.body.addEventListener("keydown", (e) => {
    gameManager.keyboardEventDown(e.key);
  });
  document.body.addEventListener("keyup", (e) => {
    gameManager.keyboardEventUp(e.key);
  });
};
