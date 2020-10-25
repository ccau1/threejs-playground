import React, { useContext, useEffect, useState } from "react";
import { GLView } from "expo-gl";
import World from "./classes/World";
import DimensionsTracker from "../components/DimensionsTracker";
import { TouchTrackerContext } from "./contexts/TouchTrackerContext";
import { ReactElementSize } from "../@hooks/web/useDimensions";
import { Dimensions, Platform } from "react-native";
import SettingsRegion from "./SettingsRegion";
import HotkeysRegion from "./HotkeysRegion";

const { width, height } = Dimensions.get("window");

export default () => {
  // instantiate states
  const [world, setWorld] = useState<World | null>(null);
  const [dimensions, setDimensions] = useState<ReactElementSize>();

  // get touch listeners
  const { addTouchListener, removeTouchListener } = useContext(
    TouchTrackerContext,
  );
  useEffect(() => {
    if (world) {
      // if platform is html based
      if (Platform.OS === "web" || Platform.OS === "windows") {
        // add stats to dom
        document.body.appendChild(world.getStats().dom);
        // listen for keyboard events
        document.addEventListener(
          "keydown",
          (ev) => world.getKeyMap().onKeyDown(ev.code),
          true,
        );
        document.addEventListener(
          "keyup",
          (ev) => world.getKeyMap().onKeyUp(ev.code),
          true,
        );
      }

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

  // update screen size
  useEffect(() => {
    if (world && dimensions && dimensions.width > 0 && dimensions.height > 0) {
      world.setScreenSize(dimensions.width, dimensions.height);
    }
  }, [world, dimensions]);

  return (
    <>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={(gl) => {
          const world = new World({ gl });
          world.setScreenSize(width, height);
          setWorld(world);
        }}
      />
      {world && <SettingsRegion world={world} />}
      {world && <HotkeysRegion world={world} />}
      <DimensionsTracker onResize={setDimensions} />
    </>
  );
};
