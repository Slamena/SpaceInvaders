import { Alien } from "./actors/Alien";
import { SpaceShip } from "./actors/SpaceShip";
import { randomeNum } from "./utils/Math";
import { Timer } from "./utils/Timer";

const root_element: HTMLElement | any = document.getElementById('root');
let score = document.createElement('p');
root_element.append(score);

window.onload = () => {
  //Obtetner el canvas
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  //Darle un contexto al canvas
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  let player = new SpaceShip({ x: 700, y: 1350 });

  // Constants
  const INITIAL_SPEED = 2;
  let timer = new Timer({ x: 20, y: 30 });

  let mainActors: Alien[] = [];

  let speed:number = INITIAL_SPEED;

  const createTimer = (ms: number) => {
    return setInterval(() => {
      let alienPos = {
        x: randomeNum(1000) + 250,
        y: -50
      }
      mainActors.push(new Alien(alienPos, speed));
    }, ms);
  }

  createTimer(1000);

  //Parte del renderizado
  let lastFrame = 0;
  const render = (time: number) => {
    // Las funciones van a ser dependientes de delta
    let delta = (time - lastFrame) / 1000;
    lastFrame = time;

    let additionalSpeed:number = Number((timer.elapsed/10).toFixed(0));
    console.log(additionalSpeed);
    speed = additionalSpeed + INITIAL_SPEED;
    
    //* Pasos:
    // - Por cada Pacman obtengo una nueva posición
    player.update(delta);
    mainActors.forEach((actor) => actor.update(delta));
    // - Borro todo el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // - Por cada Pacman dibujo la nueva posición, y dirección y movimiento de la boca
    player.draw(ctx);
    timer.draw(ctx);
    player.ammu.forEach((muni) => {
      muni.laserHit(mainActors);
      if (muni.hit) {
        player.ammu = player.ammu.filter((e) => e !== muni);
        player.updateScore(true);
      }
    })
    mainActors.forEach((actor) => {
      ctx.save();
      actor.draw(ctx);
      ctx.restore();
      if (actor.collisionDetector(player)) {
        player.lifes -= 1;
      }
      if (actor.checkDeath()) {
        mainActors = mainActors.filter((e) => e !== actor);
      }
      if (actor.checkOutLimits()) {
        mainActors = mainActors.filter((e) => e !== actor);
        player.updateScore(false);
      }
    });
    score.innerHTML = "Score: " + player.score.toString() + " points";

    if (player.checkLifes()) {
      mainActors = [];
      timer = new Timer({ x: 20, y: 30 });
    }

    // Método Recursivo
    window.requestAnimationFrame(render);
  };

  //Permite renderizar
  window.requestAnimationFrame(render);

  //Obtener tecla por medio del DOM
  document.body.addEventListener("keydown", (e) => {
    // - Controla la dirección de todos los Pacman
    player.keyboardEventDown(e.key);
  });
  document.body.addEventListener("keyup", (e) => {
    // - Controla la dirección de todos los Pacman
    player.keyboardEventUp(e.key);
  });
};
