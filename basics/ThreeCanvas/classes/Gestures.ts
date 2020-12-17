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

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture hover
   */
  onGestureHover = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    this.triggerGestureControls("onHover", { touches, summary });
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture start
   */
  onGestureStart = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    this.triggerGestureControls("onDragStart", { touches, summary });
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture move
   */
  onGestureMove = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("gesture move", touches, summary);
    this.triggerGestureControls("onDrag", { touches, summary });
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture double tap
   */
  onGestureDoubleTap = (
    touches: TouchTrackerEvent[],
    summary: TouchSummary,
  ) => {
    console.log("gesture double tap", touches, summary);
    this.triggerGestureControls("onDoubleTap", { touches, summary });
  };

  /**
   *
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on touch gesture end
   */
  onGestureEnd = (touches: TouchTrackerEvent[], summary: TouchSummary) => {
    console.log("gesture end", touches, summary);
    this.triggerGestureControls("onDragEnd", { touches, summary });
  };
}
