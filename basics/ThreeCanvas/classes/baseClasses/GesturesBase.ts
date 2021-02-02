import {
  TouchSummary,
  TouchTrackerEvent,
} from "../../contexts/TouchTrackerContext";
import World from "../World";
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
   * @param touches state of each finger's touch
   * @param summary a summary state of all fingers touched
   *
   * on mouse scroll
   */
  onGestureScroll(touches: TouchTrackerEvent[], summary: TouchSummary) {
    console.info("gesture scroll", touches, summary);
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

  triggerGestureControls(
    type: GestureControlType,
    {
      touches,
      summary,
    }: { touches: TouchTrackerEvent[]; summary: TouchSummary },
  ) {
    // controls that has been filtered for this world and sorted
    // based on priority, from highest to lowest
    const controls = Object.values(
      this.world.universe?.gestureControls.controls || {},
    )
      .filter(
        (c) =>
          c[type] ||
          !c.worldTargets?.length ||
          c.worldTargets.some((wt: string | World) =>
            typeof wt === "string" ? this.world._id === wt : this.world === wt,
          ),
      )
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // have a flag that indicates whether the loop should continue
    let isContinue = true;
    for (const control of controls) {
      control[type]?.({
        touches,
        summary,
        world: this.world,
        stopPropagation: () => (isContinue = false),
      });
      if (!isContinue) break;
    }
  }
}
