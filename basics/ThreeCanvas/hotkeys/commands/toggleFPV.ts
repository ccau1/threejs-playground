import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";

export default {
  key: "toggleFPV",
  name: "Toggle FPV",
  onDraw: (world: World) => {
    world.camera.setIsFirstPersonView(!world.camera.getIsFirstPersonView());
  },
};
