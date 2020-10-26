import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveForward",
  name: "Move Forward",
  onDraw: (world: World) => {
    world.camera.paneDelta(0, MOVE_SPEED);
  },
};
