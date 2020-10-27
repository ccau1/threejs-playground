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

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture start
   */
  onGestureStart(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture start", touches, summary);
  }

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture move
   */
  onGestureMove(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture move", touches, summary);
  }

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture double tap
   */
  onGestureDoubleTap(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture double tap", touches, summary);
  }

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture end
   */
  onGestureEnd(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture end", touches, summary);
  }

  /**
   *
   * @param summary a summary state of all fingers touched
   *
   * panes the world's camera based on summary's drag delta interval
   */
  paneCamera(summary: TouchSummary) {
    this.world.camera.paneDelta(
      summary.dragDeltaInterval.x,
      summary.dragDeltaInterval.y,
    );
  }

  /**
   *
   * @param summary a summary state of all fingers touched
   * @param cameraEndpoint end point to rotate (opposite endpoint as center)
   *
   * rotate the world's camera endpoint based on summary's drag delta interval
   */
  rotateCamera(summary: TouchSummary, cameraEndpoint: CameraEndpoint) {
    this.world.camera.rotateDelta(summary.dragDeltaInterval, cameraEndpoint);
  }
}
