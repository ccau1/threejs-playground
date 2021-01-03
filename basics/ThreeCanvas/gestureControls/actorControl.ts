import * as THREE from "three";
import { raycastIntersection } from "../threeUtils";

let dragItems: THREE.Intersection[] = [];

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

    (world.scene.scene.children as THREE.Object3D[]).forEach((obj) => {
      if (intersectedIds.includes(obj.id)) {
        // is hovering, set it
        obj.userData.hovering = true;
        // send event for hoverStart
        obj.dispatchEvent({ type: "onHoverStart", payload: props });
      } else if (obj.userData.hovering) {
        // was hovering, not anymore, remove it
        delete obj.userData.hovering;
        // send event for hoverEnd
        obj.dispatchEvent({ type: "onHoverEnd", payload: props });
      }
      if (obj.userData.hovering) {
        obj.dispatchEvent({ type: "onHovering", payload: props });
      }
    });
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
        type: "onDragStart",
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
        type: "onDrag",
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
        type: "onDragEnd",
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
