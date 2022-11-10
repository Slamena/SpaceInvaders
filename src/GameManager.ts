import { SpaceShip } from "./actors/SpaceShip";
import { randomeNum } from "./utils/Math";
import { Timer } from "./actors/Timer";
import { TextBanner } from "./actors/TextBanner";
import { Actor } from "./actors/Actor";
import { Manager } from "./actors/ActorManager";
import { Alien } from "./actors/Alien";
import { FPSViewer } from "./actors/fpsviewer";
import Swal from "sweetalert2";

export class GameManager extends Actor {
  player?: SpaceShip;
  aliensSpeed: number = 2;
  gameRunning: boolean = false;
  timer_id?: number;
  banner: TextBanner = new TextBanner("Press Enter to start.", {
    x: 600,
    y: 600,
  });
  score: TextBanner = new TextBanner("Puntos 0");
  game_id: string;
  additionalSpeed: number;
  constructor() {
    super({ x: 0, y: 0 });
    this.game_id = Math.floor(Math.random() * 1000).toFixed(0);
    // Remove previous
    Manager.delete_all_actors();

    // Create a new Game
    Manager.add_actor(this);

    // Add all actors
    let fpsViewer = new FPSViewer();
    Manager.add_actor(fpsViewer);

    this.player = new SpaceShip({ x: 700, y: 1350 });
    Manager.add_actor(this.player);

    let timer = new Timer({ x: 20, y: 30 });
    Manager.add_actor(timer);

    this.aliensSpeed = 5; // reset aliens speed to initial speed

    this.start_game();

    this.additionalSpeed = 0;
  }

  getname() {
    return `GameManager-${this.game_id}`;
  }

  update(delta: number): void {
    // Keep only live actors
    //this.aliens = this.aliens.filter((a) => !a.to_delete);
    if ((this.player?.lifes as number) < 1  || (this.player?.score as number) < 0) {
      // Stop Generating aliens
      clearInterval(this.timer_id);
      // Create a new instance
      //const new_manager = new GameManager();
      Swal.fire('Game Over');
      window.location.assign("/");
    }
  }

  start_game() {
    const new_alien_every = 1000;
    if (!this.player) {
      console.log("Please, call prepare_gameplay to restart the game first");
      return;
    } else {
      // Start creating aliens
      this.timer_id = setInterval(() => {
        let speed = Number(( (this.aliensSpeed+this.additionalSpeed) / 10).toFixed(0));
        this.additionalSpeed += 1;
        let alienPos = {
          x: randomeNum(1000) + 250,
          y: -50,
        };
        // Create an alien
        const alien = new Alien(alienPos, speed, this.player as SpaceShip);
        Manager.add_actor(alien);
      }, new_alien_every);
    }
  }
}

export let gameManager: GameManager;
