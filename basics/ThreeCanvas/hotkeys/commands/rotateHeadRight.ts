import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "rotateHeadRight",
  onDraw: (world: World) => {
    world.getCamera().rotateDelta({ x: -MOVE_SPEED, y: 0 }, "lookAt");
  },
};
