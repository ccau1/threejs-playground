import {
  TouchSummary,
  TouchTrackerEvent,
} from "../contexts/TouchTrackerContext";
import WorldBase from "./baseClasses/WorldBase";
import GesturesBase from "./baseClasses/GesturesBase";
import { setCursorPosition } from "../threeUtils";

export default class Gestures extends GesturesBase {
  constructor(world: WorldBase) {
    super(world);
  }

  onGestureHover = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    // set cursor position
    const cursor = this.world.scene.scene.getObjectByName("cursor");
    cursor && setCursorPosition(touches[0], cursor, this.world);
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture start
   */
  onGestureStart = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("gesture start", touches, summary);
    this.world.setAsSelected();
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture move
   */
  onGestureMove = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("onGestureMove");

    const isShiftKeyDown =
      this.world.keyMap["ShiftLeft"] || this.world.keyMap["ShiftRight"];
    if (this.world.camera.type === "OrthographicCamera" || isShiftKeyDown) {
      // pane screen
      this.paneCamera(summary);
    } else {
      // rotate screen
      this.rotateCamera(
        summary,
        this.world.camera.isFirstPersonView ? "lookAt" : "camera",
      );
    }
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture double tap
   */
  onGestureDoubleTap(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture double tap", touches, summary);
  }

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture end
   */
  onGestureEnd(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.log("gesture end", touches, summary);
  }
}
