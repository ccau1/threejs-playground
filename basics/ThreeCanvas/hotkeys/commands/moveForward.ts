import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveForward",
  onDraw: (world: World) => {
    world.getCamera().paneDelta(0, MOVE_SPEED);
  },
};
