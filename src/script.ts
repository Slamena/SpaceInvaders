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
  gameManager.createAliens(1000);

  //Parte del renderizado
  const render = (time: number) => {
    //* Pasos:
    // - Por cada Pacman obtengo una nueva posición
    gameManager.update();
    // - Borro todo el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    gameManager.draw(ctx);
    ctx.restore();

    gameManager.laserHit();
    gameManager.collisionDetecto();
    gameManager.checkLifes();
    gameManager.checkScore();
    score.innerHTML = "Score: " + gameManager.score() + " points";

    // Método Recursivo
    window.requestAnimationFrame(render);
  };

  //Permite renderizar
  window.requestAnimationFrame(render);

  //Obtener tecla por medio del DOM
  document.body.addEventListener("keydown", (e) => {
    // - Controla la dirección de todos los Pacman
    gameManager.keyboardEventDown(e.key);
  });
  document.body.addEventListener("keyup", (e) => {
    // - Controla la dirección de todos los Pacman
    gameManager.keyboardEventUp(e.key);
  });
};
