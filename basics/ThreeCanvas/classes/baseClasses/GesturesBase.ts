import {
  TouchSummary,
  TouchTrackerEvent,
} from "../../contexts/TouchTrackerContext";
import WorldBase from "./WorldBase";

export default class GesturesBase {
  world: WorldBase;
  constructor(world: WorldBase) {
    this.world = world;
  }

  onGestureStart(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture start", touches, summary);
  }

  onGestureMove(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture move", touches, summary);
  }

  onGestureDoubleTap(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture double tap", touches, summary);
  }

  onGestureEnd(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture end", touches, summary);
  }

  paneCamera(summary: TouchSummary) {
    this.world
      .getCamera()
      .paneDelta(summary.dragDeltaInterval.x, summary.dragDeltaInterval.y);
  }

  rotateCamera(summary: TouchSummary, cameraEndpoint: CameraEndpoint) {
    this.world
      .getCamera()
      .rotateDelta(summary.dragDeltaInterval, cameraEndpoint);
  }
}
