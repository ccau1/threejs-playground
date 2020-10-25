import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "rotateHeadUp",
  onDraw: (world: World) => {
    world.getCamera().rotateDelta({ x: 0, y: MOVE_SPEED }, "lookAt");
  },
};
