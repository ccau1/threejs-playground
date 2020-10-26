import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "rotateHeadUp",
  name: "Rotate Head Up",
  onDraw: (world: World) => {
    world.camera.rotateDelta({ x: 0, y: MOVE_SPEED }, "lookAt");
  },
};
