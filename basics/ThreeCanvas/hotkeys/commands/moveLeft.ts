import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "moveLeft",
  onDraw: (world: World) => {
    world.getCamera().paneDelta(MOVE_SPEED, 0);
  },
};
