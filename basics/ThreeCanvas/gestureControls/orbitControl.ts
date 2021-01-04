import Camera from "../classes/Camera";

export default {
  name: "orbitControl",
  priority: -10,
  onDrag: (ev) => {
    (ev.world.camera as Camera).camera.dispatchEvent({
      type: "onTouchDrag",
      payload: ev,
    });
  },
} as GestureControl;
