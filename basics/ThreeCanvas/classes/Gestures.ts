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

  onGestureStart(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture start", touches, summary);
  }

  onGestureMove = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    const isShiftKeyDown =
      this.world.getKeyMap()["ShiftLeft"] ||
      this.world.getKeyMap()["ShiftRight"];
    if (
      this.world.getCamera().getType() === "OrthographicCamera" ||
      isShiftKeyDown
    ) {
      // pane screen
      this.paneCamera(summary);
    } else {
      // rotate screen
      this.rotateCamera(
        summary,
        this.world.getCamera().getIsFirstPersonView() ? "lookAt" : "camera",
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
