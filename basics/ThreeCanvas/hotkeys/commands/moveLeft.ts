import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveLeft",
  name: "Move Left",
  onDraw: (world: World) => {
    world.camera.paneDelta(MOVE_SPEED, 0);
  },
};
