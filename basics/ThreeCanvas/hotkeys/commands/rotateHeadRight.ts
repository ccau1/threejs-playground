import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "rotateHeadRight",
  name: "Rotate Head Right",
  onDraw: (world: World) => {
    world.camera.rotateDelta({ x: -MOVE_SPEED, y: 0 }, "lookAt");
  },
};
