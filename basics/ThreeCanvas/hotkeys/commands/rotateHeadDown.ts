import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "rotateHeadDown",
  name: "Rotate Head Down",
  onDraw: (world: World) => {
    world.getCamera().rotateDelta({ x: 0, y: -MOVE_SPEED }, "lookAt");
  },
};
