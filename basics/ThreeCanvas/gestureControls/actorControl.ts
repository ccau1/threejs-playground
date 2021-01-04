import * as THREE from "three";
import { raycastIntersection } from "../threeUtils";

let dragItems: THREE.Intersection[] = [];
let hoveringItems: THREE.Intersection[] = [];

export default {
  name: "actorControl",
  onHover: (props) => {
    const { summary, world } = props;
    // get element mouse is hovering
    const intersections = raycastIntersection(
      summary.fingersCenter,
      world,
      world.camera.camera,
      world.scene.scene.children,
    );
    const intersectedIds = intersections.map((i) => i.object.id);

    const hoverIntersections = [];
    const hoverStartIntersections = [];

    for (const intersection of intersections) {
      if (hoveringItems.some((hi) => hi.object.id === intersection.object.id)) {
        // already hovering, continue hovering
        hoverIntersections.push(intersection);
      } else {
        // new hovering, add to hover start
        hoverStartIntersections.push(intersection);
      }
    }
    // get all items to end hovering
    const hoverEndIntersections = hoveringItems.filter((hi) =>
      intersectedIds.every((h) => h !== hi.object.id),
    );

    // handle all hover end events
    hoverEndIntersections.forEach((intersection) => {
      // was hovering, not anymore, remove it
      delete intersection.object.userData.hovering;
      // send event for hoverEnd
      intersection.object.dispatchEvent({ type: "onHoverEnd", payload: props });
    });

    // handle all hover start events
    hoverStartIntersections.forEach((intersection) => {
      // was hovering, not anymore, remove it
      intersection.object.userData.hovering = true;
      // send event for hoverEnd
      intersection.object.dispatchEvent({
        type: "onHoverStart",
        payload: props,
      });
    });

    // handle all hover start events
    hoverIntersections.forEach((intersection) => {
      // send event for hoverEnd
      intersection.object.dispatchEvent({ type: "onHovering", payload: props });
    });

    // store current intersection for next time
    hoveringItems = intersections;
  },
  onDragStart: (props) => {
    const { summary, world } = props;
    // get element mouse is hovering
    dragItems = raycastIntersection(
      summary.fingersCenter,
      world,
      world.camera.camera,
      world.scene.scene.children,
    );
    let isStopPropagation = false;

    for (const [index, intersection] of dragItems.entries()) {
      // send event for hoverStart
      intersection.object.dispatchEvent({
        type: "onTouchDragStart",
        payload: {
          ...props,
          stopPropagation: () => {
            props.stopPropagation();
            isStopPropagation = true;
          },
        },
      });
      if (isStopPropagation) {
        dragItems = dragItems.slice(0, index + 1);
        break;
      }
    }
  },
  onDrag: (props) => {
    let isStopPropagation = false;

    for (const [index, intersection] of dragItems.entries()) {
      // send event for drag
      intersection.object.dispatchEvent({
        type: "onTouchDrag",
        payload: {
          ...props,
          stopPropagation: () => {
            props.stopPropagation();
            isStopPropagation = true;
          },
        },
      });
      if (isStopPropagation) {
        break;
      }
    }
  },
  onDragEnd: (props) => {
    let isStopPropagation = false;

    for (const [index, intersection] of dragItems.entries()) {
      // send event for dragEnd
      intersection.object.dispatchEvent({
        type: "onTouchDragEnd",
        payload: {
          ...props,
          stopPropagation: () => {
            props.stopPropagation();
            isStopPropagation = true;
          },
        },
      });
      if (isStopPropagation) {
        break;
      }
    }
    dragItems = [];
  },
} as GestureControl;
