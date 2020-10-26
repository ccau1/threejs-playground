import {
  TouchSummary,
  TouchTrackerEvent,
} from "../contexts/TouchTrackerContext";
import WorldBase from "./baseClasses/WorldBase";
import GesturesBase from "./baseClasses/GesturesBase";

export default class Gestures extends GesturesBase {
  constructor(world: WorldBase) {
    super(world);
  }

  onGestureStart = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("gesture start", touches, summary);
    this.world.setAsSelected();
  };

  onGestureMove = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("onGestureMove");

    const isShiftKeyDown =
      this.world.keyMap["ShiftLeft"] || this.world.keyMap["ShiftRight"];
    if (
      this.world.camera.getType() === "OrthographicCamera" ||
      isShiftKeyDown
    ) {
      // pane screen
      this.paneCamera(summary);
    } else {
      // rotate screen
      this.rotateCamera(
        summary,
        this.world.camera.getIsFirstPersonView() ? "lookAt" : "camera",
      );
    }
  };

  onGestureDoubleTap(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture double tap", touches, summary);
  }

  onGestureEnd(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture end", touches, summary);
  }
}
