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
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onComplete(() => {
        new TWEEN.Tween(world.camera.position)
          .to({ y: originalYPosition }, 300)
          .onUpdate(() => {
            world.camera.syncPosition();
          })
          .easing(TWEEN.Easing.Cubic.In)
          .onComplete(() => {
            IS_JUMPING = false;
          })
          .start();
      })
      .start();
    world.camera.paneDelta(MOVE_SPEED, 0);
  },
};
