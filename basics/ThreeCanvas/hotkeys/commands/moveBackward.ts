import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveBackward",
  name: "Move Backward",
  onDraw: (world: World) => {
    world.camera.paneDelta(0, -MOVE_SPEED);
  },
};
