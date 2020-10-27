import World from "../../classes/World";
import { MOVE_SPEED } from "./_constants";
import TWEEN from "@tweenjs/tween.js";

let IS_JUMPING = false;

export default {
  key: "jump",
  name: "Jump",
  onDraw: (world: World) => {
    if (IS_JUMPING) return;
    IS_JUMPING = true;
    const originalYPosition = world.camera.position.y;
    new TWEEN.Tween(world.camera.position)
      .to({ y: originalYPosition + 2 }, 300)
      .onUpdate(() => {
        world.camera.syncPosition();
      })
      .onComplete(() => {
        setTimeout(() => {
          new TWEEN.Tween(world.camera.position)
            .to({ y: originalYPosition }, 300)
            .onUpdate(() => {
              world.camera.syncPosition();
            })
            .onComplete(() => {
              IS_JUMPING = false;
            })
            .start();
        }, 200);
      })
      .start();
    world.camera.paneDelta(MOVE_SPEED, 0);
  },
};
