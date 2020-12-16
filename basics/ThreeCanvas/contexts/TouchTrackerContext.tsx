import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  PanResponder,
  PanResponderInstance,
  PanResponderGestureState,
  GestureResponderEvent,
} from "react-native";
import useDimensions from "../../@hooks/web/useDimensions";
import { isHtmlPlatform } from "../utils";

const DOUBLE_PRESS_DELAY: number = 200;

//refer to interface PanResponderGestureState for some definitions
export interface TouchTrackerEvent {
  x: number;
  y: number;
  lastXInterval: number;
  lastYInterval: number;
  force?: number;
  isTouched: boolean;
  target: string;
  originalX: number;
  originalY: number;
  deltaX: number;
  deltaY: number;
  deltaXInterval: number;
  deltaYInterval: number;
  originalCenterAngle: number; //angle between center point and touch
  deltaCenterAngle: number;
  deltaCenterAngleInterval: number;
  originalCenterDistance: number; // distance between center point and touch
  deltaCenterDistance: number;
  deltaCenterDistanceInterval: number;
  [key: string]: number | string | boolean | undefined;
}
export interface TouchSummary {
  scaleDelta: number; // resize from original size
  rotateDelta: number;
  dragDelta: Position2D;
  scaleDeltaInterval: number;
  rotateDeltaInterval: number;
  dragDeltaInterval: Position2D;
  fingersCenter: Position2D;
  isOutOfBound: boolean;
}

export type TouchTrackerListener = (
  touches: TouchTrackerEvent[],
  summary: TouchSummary,
) => void;

export interface TouchTrackerContextProps {
  getTouches: () => TouchTrackerEvent[];
  getTouchSummary: () => TouchSummary;
  addTouchListener: (
    type: "start" | "move" | "end" | "double" | "hover",
    fn: TouchTrackerListener,
  ) => void;
  removeTouchListener: (
    type: "start" | "move" | "end" | "double" | "hover",
    fn: TouchTrackerListener,
  ) => void;
}

export interface TouchTrackerProviderProps {
  children: ChildrenElement;
}

export const TouchTrackerContext = React.createContext<TouchTrackerContextProps>(
  {
    getTouches: () => [],
    getTouchSummary: () => ({
      scaleDelta: 0, // resize from original size
      rotateDelta: 0,
      dragDelta: { x: 0, y: 0 },
      scaleDeltaInterval: 0,
      rotateDeltaInterval: 0,
      dragDeltaInterval: { x: 0, y: 0 },
      fingersCenter: { x: 0, y: 0 },
      isOutOfBound: false,
    }),
    addTouchListener: (
      type: "start" | "move" | "end" | "double" | "hover",
      fn: TouchTrackerListener,
    ) => null,
    removeTouchListener: (
      type: "start" | "move" | "end" | "double" | "hover",
      fn: TouchTrackerListener,
    ) => null,
  },
);

const Provider = ({ children }: TouchTrackerProviderProps) => {
  //For future state use
  // const { blueprintState } = useContext(BlueprintStateContext);
  const scaleSpeed: number = 300;
  const scaleRatio: number = 0.1;

  const touchesRef = useRef<TouchTrackerEvent[]>([]);

  const topLeftDivRef = useRef<HTMLDivElement | any>(null);

  const DEFAULT_TOUCH_SUMMARY = {
    scaleDelta: 0,
    rotateDelta: 0,
    dragDelta: {
      x: 0,
      y: 0,
    },
    scaleDeltaInterval: 0,
    rotateDeltaInterval: 0,
    dragDeltaInterval: {
      x: 0,
      y: 0,
    },
    fingersCenter: {
      x: 0,
      y: 0,
    },
    isOutOfBound: false,
  };

  const touchSummaryRef = useRef<TouchSummary>(DEFAULT_TOUCH_SUMMARY);

  const lastTapRef = useRef<number | null>(null);

  const [touchFns, setTouchFns] = useState<{
    start: TouchTrackerListener[];
    move: TouchTrackerListener[];
    end: TouchTrackerListener[];
    double: TouchTrackerListener[];
    hover: TouchTrackerListener[];
  }>({
    start: [],
    move: [],
    end: [],
    double: [],
    hover: [],
  });
  const value = useMemo<TouchTrackerContextProps>(() => {
    const innerTouchFns = touchFns;
    return {
      getTopLeftDiv() {
        return topLeftDivRef.current;
      },
      getTouches() {
        return touchesRef.current;
      },
      getTouchSummary() {
        return touchSummaryRef.current;
      },
      addTouchListener(type, fn: TouchTrackerListener) {
        touchFns[type].push(fn);
      },
      removeTouchListener(type, fn: TouchTrackerListener) {
        innerTouchFns[type] = touchFns[type].filter((f) => "" + f !== "" + fn);
        setTouchFns(innerTouchFns);
      },
    };
  }, [touchFns]);

  const isTouched = (): boolean => {
    return touchesRef.current.length > 0;
  };

  const [ref, dimensions] = useDimensions();

  //get position relative to parent
  const isOutOfBound = (ev: {
    locationX: number;
    locationY: number;
  }): boolean => {
    return (
      ev &&
      dimensions !== null &&
      (ev.locationX < dimensions.left ||
        ev.locationY < dimensions.top ||
        ev.locationX > dimensions.left + dimensions.width ||
        ev.locationY > dimensions.top + dimensions.height)
    );
  };

  const distanceDeltaToScale = (
    scaleDelta: number,
    options?: { breakpoint?: number; speed?: number },
  ): number => {
    const opts = {
      scaleSpeed: scaleSpeed || 300,
      scaleRatio: scaleRatio || 0.1,
      ...options,
    };
    return 1 + (scaleDelta / opts.scaleSpeed) * opts.scaleRatio;
  };

  // get the delta of the distance btw coordinate and center
  // if no previous coordinate, current delta is the current distance to center
  const getDeltaCenterDistance = (originalCenterDistance: number): number => {
    return touchesRef.current.length
      ? originalCenterDistance - touchesRef.current[0].originalCenterDistance
      : 0;
  };

  // get the delta of x and y
  const getDelta = (
    currentXY: Position2D,
    originalXY: Position2D,
  ): Position2D => {
    return {
      x: currentXY.x - originalXY.x,
      y: currentXY.y - originalXY.y,
    };
  };

  const getDeltaInterval = (
    currentXY: Position2D,
    originalXY: Position2D,
  ): Position2D => {
    if (!touchesRef.current.length) {
      return {
        x: getDelta(currentXY, originalXY).x,
        y: getDelta(currentXY, originalXY).y,
      };
    }

    return {
      x: currentXY.x - touchesRef.current[touchesRef.current.length - 1].x,
      y: currentXY.y - touchesRef.current[touchesRef.current.length - 1].y,
    };
  };
  const getDeltaCenterDistanceInterval = (
    deltaCenterDistance: number,
  ): number => {
    return touchesRef.current.length
      ? deltaCenterDistance -
          touchesRef.current[touchesRef.current.length - 1].deltaCenterDistance
      : 0;
  };

  const getScaleDeltaInterval = (scaleDelta: number): number => {
    return touchesRef.current.length
      ? scaleDelta - touchSummaryRef.current.scaleDelta
      : 0;
  };

  const getRotateDeltaInterval = (rotateDelta: number): number => {
    return touchesRef.current.length
      ? rotateDelta - touchSummaryRef.current.rotateDelta
      : 0;
  };

  const getCoordinateDistance = (
    pos1: Position2D,
    pos2: Position2D,
  ): number => {
    return ((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2) ** 0.5;
  };

  //for reduce method
  const xyDeltaAverages = (
    xy: Position2D,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[],
  ) => {
    // sum up all delta x and delta y
    xy.x += touch.deltaX;
    xy.y += touch.deltaY;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      xy.x = xy.x / newTouches.length;
      xy.y = xy.y / newTouches.length;
    }

    return xy;
  };

  //for reduce method
  const xyDeltaIntervalAverage = (
    xyInterval: Position2D,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[],
  ) => {
    // sum up all delta x and delta y interval
    xyInterval.x += touch.deltaXInterval;
    xyInterval.y += touch.deltaYInterval;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      xyInterval.x = xyInterval.x / newTouches.length;
      xyInterval.y = xyInterval.y / newTouches.length;
    }

    return xyInterval;
  };

  //for reduce method
  const scaleDeltaAverage = (
    accDistance: number,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[],
  ) => {
    // sum up all finger's delta distance from fingersCenter
    accDistance += touch.deltaCenterDistance;

    // if it is the last one, divide by length to get the avg
    if (touchIndex === newTouches.length - 1) {
      accDistance = accDistance / newTouches.length;
    }

    return accDistance;
  };

  //for reduce method
  const rotateDeltaAverage = (
    accMove: number,
    touch: TouchTrackerEvent,
    touchIndex: number,
    newTouches: TouchTrackerEvent[],
  ): number => {
    accMove += touch.originalCenterAngle;

    if (touchIndex === newTouches.length - 1) {
      accMove = accMove / newTouches.length;
    }

    return accMove;
  };

  //rotation angle
  const getOriginalCenterAngle = (
    current: Position2D,
    center: Position2D,
  ): number => {
    const angle =
      (Math.atan2(current.y - center.y, current.x - center.x) * 180) / Math.PI;
    return angle > 0 ? angle : 360 + angle;
  };

  // get the delta of the angle btw coordinate and center
  // if no previous coordinate, current delta is the current angle to center
  const getDeltaCenterAngle = (originalCenterAngle: number): number => {
    return touchesRef.current.length
      ? originalCenterAngle - touchesRef.current[0].originalCenterAngle
      : 0;
  };

  const getDeltaCenterAngleInterval = (deltaCenterAngle: number): number => {
    return touchesRef.current.length
      ? deltaCenterAngle -
          touchesRef.current[touchesRef.current.length - 1].deltaCenterAngle
      : 0;
  };

  const getFingersCenter = (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ) => {
    evt.nativeEvent.locationX;
    const { numberActiveTouches } = gestureState;

    //Create an array with length equal to number of touches each time
    return Array.from({ length: numberActiveTouches }).reduce<Position2D>(
      (pos2dAcc: Position2D, v, vIndex: number) => {
        pos2dAcc.x += evt.nativeEvent.locationX;
        pos2dAcc.y += evt.nativeEvent.locationY;

        if (vIndex >= numberActiveTouches - 1) {
          // last item, handle avg
          pos2dAcc.x /= numberActiveTouches;
          pos2dAcc.y /= numberActiveTouches;
        }
        return pos2dAcc;
      },
      { x: 0, y: 0 },
    );
  };
  const originalXY = (currentXY: Position2D): Position2D => {
    return touchesRef.current.length
      ? {
          x: touchesRef.current[0].originalX,
          y: touchesRef.current[0].originalY,
        }
      : {
          x: currentXY.x,
          y: currentXY.y,
        };
  };
  const generateTouches = (
    evt: GestureResponderEvent,
    gestureState: PanResponderGestureState,
  ): TouchTrackerEvent[] => {
    const newTouches: TouchTrackerEvent[] = [];
    const {
      moveX,
      moveY,
      x0,
      y0,
      dx,
      dy,
      vx,
      vy,
      numberActiveTouches,
    } = gestureState;

    for (let i = 0; i < numberActiveTouches; i++) {
      // if start, x = originalX and y = originalY, if moved, x = moveX and y = moveY
      const currentXY: Position2D = { x: moveX || x0, y: moveY || y0 };
      const lastInterval: Position2D = isTouched()
        ? {
            x: touchesRef.current[touchesRef.current.length - 1].deltaXInterval,
            y: touchesRef.current[touchesRef.current.length - 1].deltaYInterval,
          }
        : { x: vx, y: vy };
      // const thisTouch = touchEvent.touches[i] as TouchEvent;
      // const { force }: TouchEvent = thisTouch;
      const originalCenterAngle: number = getOriginalCenterAngle(currentXY, {
        x: x0,
        y: y0,
      });
      const deltaCenterAngle: number = getDeltaCenterAngle(originalCenterAngle);
      const deltaCenterAngleInterval: number = getDeltaCenterAngleInterval(
        deltaCenterAngle,
      );
      //distance between original point and the touch(es)
      const originalCenterDistance: number = getCoordinateDistance(
        { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY },
        getFingersCenter(evt, gestureState),
      );
      const deltaCenterDistance: number = getDeltaCenterDistance(
        originalCenterDistance,
      );
      const deltaCenterDistanceInterval: number = getDeltaCenterDistanceInterval(
        originalCenterDistance,
      );
      const originalXAndY: Position2D = originalXY(currentXY);
      const deltaXInterval: number = getDeltaInterval(currentXY, originalXAndY)
        .x;
      const deltaYInterval: number = getDeltaInterval(currentXY, originalXAndY)
        .y;

      newTouches.push({
        x: currentXY.x,
        y: currentXY.y,
        lastXInterval: lastInterval.x,
        lastYInterval: lastInterval.y,
        // force: force,
        isTouched: true,
        target: (evt.nativeEvent.target as any).tagName,
        originalX: x0,
        originalY: y0,
        deltaX: dx,
        deltaY: dy,
        deltaXInterval: deltaXInterval,
        deltaYInterval: deltaYInterval,
        originalCenterAngle: originalCenterAngle,
        deltaCenterAngle: deltaCenterAngle,
        deltaCenterAngleInterval: deltaCenterAngleInterval,
        originalCenterDistance: originalCenterDistance,
        deltaCenterDistance: deltaCenterDistance,
        deltaCenterDistanceInterval: deltaCenterDistanceInterval,
      });
    }

    return newTouches;
  };

  //****** PanResponder ******
  const panStartTimeout = useRef<number>();
  const panEndTimeout = useRef<number>();
  const panResponder = useRef<PanResponderInstance>(
    PanResponder.create({
      // Ask to be the responder:
      // The deepest component will become responder
      // when multiple Views return true for *ShouldSetResponder handlers

      // Does this view want to become responder on the start of a touch?
      onStartShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => true,
      onStartShouldSetPanResponderCapture: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => true,

      // Called for every touch move on the View when it is not the responder:
      // Does this view want to "claim" touch responsiveness?
      onMoveShouldSetPanResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => true,
      onMoveShouldSetPanResponderCapture: (
        evt,
        gestureState: PanResponderGestureState,
      ) => true,

      // If the View returns true and attempts to become the responder:
      onPanResponderGrant: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // The View is now responding for touch events
        // gestureState.d{x,y} will be set to zero

        const { dx, dy, vx, vy }: PanResponderGestureState = gestureState;

        const fingersCenter: Position2D = getFingersCenter(evt, gestureState);

        const newTouchSummary: TouchSummary = {
          scaleDelta: 0,
          rotateDelta: 0,
          dragDelta: {
            x: dx,
            y: dy,
          },
          scaleDeltaInterval: vx,
          rotateDeltaInterval: vy,
          dragDeltaInterval: {
            x: 0,
            y: 0,
          },
          fingersCenter: {
            x: fingersCenter.x,
            y: fingersCenter.y,
          },
          isOutOfBound: isOutOfBound({
            locationX: fingersCenter.x,
            locationY: fingersCenter.y,
          }),
        };
        touchSummaryRef.current = newTouchSummary;

        const newTouches: TouchTrackerEvent[] = generateTouches(
          evt,
          gestureState,
        );
        touchesRef.current = newTouches;

        clearTimeout(panStartTimeout.current);
        // panStartTimeout.current = setTimeout(() => {
        //If no previous tap or the time between previous tap
        //and this tap is greater than specified delay for double tap,
        //count it as a normal tap and end it
        //setTimeout to make sure enough delay between each normal tap end
        touchFns.start.forEach((fn) => fn(newTouches, newTouchSummary));
        // }, DOUBLE_PRESS_DELAY);
      },
      onPanResponderReject: (
        evt: GestureResponderEvent,
        gestureStart: PanResponderGestureState,
      ) => {
        //Something else is the responder right now and will not release it
      },

      //If the view is responding, the following handlers can be called:
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // The user is moving their finger
        // The most recent move distance is gestureState:
        // PanResponderGestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState: PanResponderGestureState.d{x,y}

        const fingersCenter: Position2D = getFingersCenter(evt, gestureState);
        const newTouches: TouchTrackerEvent[] = generateTouches(
          evt,
          gestureState,
        );
        touchesRef.current = newTouches;
        // check how many fingers touching
        const touchCount: number = evt.nativeEvent.touches.length;

        const scaleDelta: number =
          touchCount >= 2 //at least 2 fingers touching
            ? distanceDeltaToScale(
                newTouches.reduce<number>(scaleDeltaAverage, 0),
              )
            : 0;
        const rotateDelta: number =
          touchCount >= 2 //at least 2 fingers touching
            ? newTouches.reduce<number>(rotateDeltaAverage, 0)
            : 0;
        const dragDelta: Position2D =
          touchCount >= 1 //at least 1 finger touching
            ? newTouches.reduce<Position2D>(xyDeltaAverages, { x: 0, y: 0 })
            : { x: 0, y: 0 };

        const newTouchSummary: TouchSummary = {
          scaleDelta: scaleDelta,
          rotateDelta: rotateDelta,
          dragDelta: dragDelta,
          scaleDeltaInterval: getScaleDeltaInterval(scaleDelta),
          rotateDeltaInterval: getRotateDeltaInterval(rotateDelta),
          dragDeltaInterval: newTouches.reduce<Position2D>(
            xyDeltaIntervalAverage,
            {
              x: 0,
              y: 0,
            },
          ),
          fingersCenter: fingersCenter,
          isOutOfBound: isOutOfBound({
            locationX: fingersCenter.x,
            locationY: fingersCenter.y,
          }),
        };
        touchSummaryRef.current = newTouchSummary;

        touchFns.move.forEach((fn) => fn(newTouches, newTouchSummary));
      },
      //Something else wants to become responder.
      //Should this view release the responder? Returning true allows release
      onPanResponderTerminationRequest: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => true,
      onPanResponderRelease: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // handle double tap
        let isDoubleTap = false;
        if (
          //if there is last tap and the time between this tap and
          //last tap is smaller than specified delay for double tap,
          //count it as a double tap
          //Else, just set the last tap as this tap
          // lastTapRef.current &&
          lastTapRef.current &&
          Date.now() - lastTapRef.current < DOUBLE_PRESS_DELAY
        ) {
          touchFns.double.forEach((fn) =>
            fn(touchesRef.current, touchSummaryRef.current),
          );
          clearTimeout(panStartTimeout.current);
          clearTimeout(panEndTimeout.current);
          isDoubleTap = true;
        }
        lastTapRef.current = Date.now();

        clearTimeout(panEndTimeout.current);
        if (!isDoubleTap) {
          // panEndTimeout.current = setTimeout(() => {
          //If no previous tap or the time between previous tap
          //and this tap is greater than specified delay for double tap,
          //count it as a normal tap and end it
          touchFns.end.forEach((fn) =>
            fn(touchesRef.current, touchSummaryRef.current),
          );
          // }, DOUBLE_PRESS_DELAY);
        }
        touchesRef.current.splice(0);
        touchSummaryRef.current = DEFAULT_TOUCH_SUMMARY;
      },
      onPanResponderTerminate: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // Another component has become the responder
        // This gesture should be cancelled
        const now = Date.now();
        // handle double tap
        if (
          //if there is last tap and the time between this tap and
          //last tap is smaller than specified delay for double tap,
          //count it as a double tap
          //Else, just set the last tap as this tap
          // lastTapRef.current &&
          lastTapRef.current &&
          now - lastTapRef.current < DOUBLE_PRESS_DELAY
        ) {
          touchFns.double.forEach((fn) =>
            fn(touchesRef.current, touchSummaryRef.current),
          );
          clearTimeout(panStartTimeout.current);
          clearTimeout(panEndTimeout.current);
        }
        lastTapRef.current = now;
        touchesRef.current.splice(0);
        touchSummaryRef.current = DEFAULT_TOUCH_SUMMARY;
      },
      onShouldBlockNativeResponder: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  );

  const mouseActions = useRef<{
    [key: string]: (ev: MouseEvent) => void;
  }>({});

  useEffect(() => {
    mouseActions.current.onMouseMove = (ev: MouseEvent) => {
      if (
        dimensions &&
        !isOutOfBound({
          locationX: ev.x,
          locationY: ev.y,
        }) &&
        !touchesRef.current[0]?.isTouched
      ) {
        const x = ev.x - dimensions.left;
        const y = ev.y - dimensions.top;

        const touch: TouchTrackerEvent = {
          x,
          y,
          lastXInterval: touchesRef.current[0]?.x || 0,
          lastYInterval: touchesRef.current[0]?.y || 0,
          force: 0,
          isTouched: false,
          target: (ev.target as any).tagName,
          originalX: x,
          originalY: y,
          deltaX: 0,
          deltaY: 0,
          deltaXInterval: x - (touchesRef.current[0]?.x || 0),
          deltaYInterval: y - (touchesRef.current[0]?.y || 0),
          originalCenterAngle: 0,
          deltaCenterAngle: 0,
          deltaCenterAngleInterval: 0,
          originalCenterDistance: 0,
          deltaCenterDistance: 0,
          deltaCenterDistanceInterval: 0,
        };
        touchesRef.current = [touch];

        const touchSummary: TouchSummary = {
          ...DEFAULT_TOUCH_SUMMARY,
          fingersCenter: {
            x: touch.x,
            y: touch.y,
          },
        };
        touchSummaryRef.current = touchSummary;

        touchFns.hover.forEach((fn) => fn([touch], touchSummary));
      }
    };
  }, [dimensions, touchesRef.current, touchSummaryRef.current]);

  useEffect(() => {
    const eventListener = (type: string) => (ev: MouseEvent) =>
      mouseActions.current[type](ev);
    if (dimensions && isHtmlPlatform()) {
      window.addEventListener("mousemove", eventListener("onMouseMove"));

      return () =>
        window.removeEventListener("mousemove", eventListener("onMouseMove"));
    }
  }, [dimensions]);

  return (
    <TouchTrackerContext.Provider value={value}>
      <View ref={ref} style={{ flex: 1 }} {...panResponder.current.panHandlers}>
        {children}
      </View>
    </TouchTrackerContext.Provider>
  );
};

export default {
  ...TouchTrackerContext,
  Provider,
  Consumer: TouchTrackerContext.Consumer,
};
