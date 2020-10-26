import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveRight",
  name: "Move Right",
  onDraw: (world: World) => {
    world.camera.paneDelta(-MOVE_SPEED, 0);
  },
};
