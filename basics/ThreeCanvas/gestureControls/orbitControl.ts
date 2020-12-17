export default {
  name: "orbitControl",
  priority: -10,
  onDrag: ({ summary, world }) => {
    const isShiftKeyDown =
      world.keyMap["ShiftLeft"] || world.keyMap["ShiftRight"];
    if (world.camera.type === "OrthographicCamera" || isShiftKeyDown) {
      // pane screen
      // this.paneCamera(summary);
      world.camera.paneDelta(
        summary.dragDeltaInterval.x,
        summary.dragDeltaInterval.y,
      );
    } else {
      // rotate screen
      world.camera.rotateDelta(
        summary.dragDeltaInterval,
        world.camera.isFirstPersonView ? "lookAt" : "camera",
      );
    }
  },
} as GestureControl;
