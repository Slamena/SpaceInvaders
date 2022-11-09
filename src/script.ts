import { Actor } from "./actors/Actor";
import { Manager } from "./actors/ActorManager";
import { GameManager } from "./GameManager";

const root_element: HTMLElement | any = document.getElementById("root");
let score = document.createElement("p");
root_element.append(score);

window.onload = () => {
  //Obtetner el canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  //Darle un contexto al canvas
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  let gameManager = new GameManager();

  //Parte del renderizado
  let lastFrame = 0;

  const render = (time: number) => {
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;
    Manager.get_actors().forEach((actor) => actor.update(delta));

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    Manager.get_actors().forEach((actor) => actor.draw(ctx, delta));
    ctx.restore();

    // Método Recursivo
    window.requestAnimationFrame(render);
  };

  //Permite renderizar
  window.requestAnimationFrame(render);

  document.body.addEventListener("keydown", (e) => {
    Manager.get_actors().forEach((actor) => {
      if (typeof actor.keyboardEventDown != "undefined") {
        actor.keyboardEventDown(e.key);
      }
    });
  });
  document.body.addEventListener("keyup", (e) => {
    Manager.actors.forEach((actor) => {
      if (typeof actor.keyboardEventUp != "undefined") {
        actor.keyboardEventUp(e.key);
      }
    });
  });
};
