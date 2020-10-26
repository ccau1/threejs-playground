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
    console.info("gesture start", touches, summary);
  }

  onGestureMove(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture move", touches, summary);
  }

  onGestureDoubleTap(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture double tap", touches, summary);
  }

  onGestureEnd(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture end", touches, summary);
  }

  paneCamera(summary: TouchSummary) {
    this.world.camera.paneDelta(
      summary.dragDeltaInterval.x,
      summary.dragDeltaInterval.y,
    );
  }

  rotateCamera(summary: TouchSummary, cameraEndpoint: CameraEndpoint) {
    this.world.camera.rotateDelta(summary.dragDeltaInterval, cameraEndpoint);
  }
}
