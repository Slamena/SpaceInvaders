import { Point } from "../types/Point";
import { Actor } from "./Actor";

class ActorManager extends Actor {
  actors: Actor[] = [];
  constructor(pos: Point) {
    super(pos);
  }

  getname(): string {
    return "🚀 ROOT";
  }

  add_actor(a: Actor) {
    this.actors.push(a);
  }

  remove_actor(a: Actor) {
    this.actors = this.actors.filter((e) => e != a);
  }

  get_actors() {
    return [this, ...this.actors];
  }

  delete_all_actors() {
    this.actors = [];
  }

  update() {
    // Delete actors from manager that are marked for removal
    this.actors = this.actors.filter((actor) => !actor.to_delete);
  }

  draw(ctx: CanvasRenderingContext2D, delta: number): void {
    ctx.font = "35px Consolas";
    ctx.fillStyle = "#FFF";

    for (let i = 0; i < this.actors.length; i++) {
      ctx.fillText(
        `- ${this.actors[i].getname()}`,
        this.position.x,
        this.position.y + 40 * i
      );
      ctx.fill();
    }
  }
}

let Manager = new ActorManager({ x: 20, y: 80 });

export { Manager };
