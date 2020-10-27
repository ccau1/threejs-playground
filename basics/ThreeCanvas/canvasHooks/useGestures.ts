import { useContext, useEffect } from "react";
import World from "../classes/World";
import { TouchTrackerContext } from "../contexts/TouchTrackerContext";

export default (world: World) => {
  // get touch listeners
  const { addTouchListener, removeTouchListener } = useContext(
    TouchTrackerContext,
  );

  useEffect(() => {
    if (world) {
      // link gesture events
      addTouchListener("start", world.gestures.onGestureStart);
      addTouchListener("move", world.gestures.onGestureMove);
      addTouchListener("double", world.gestures.onGestureDoubleTap);
      addTouchListener("end", world.gestures.onGestureEnd);
    }

    return () => {
      if (world) {
        // remove gesture events
        removeTouchListener("start", world.gestures.onGestureStart);
        removeTouchListener("move", world.gestures.onGestureMove);
        removeTouchListener("double", world.gestures.onGestureDoubleTap);
        removeTouchListener("end", world.gestures.onGestureEnd);
      }
    };
  }, [world]);
};
