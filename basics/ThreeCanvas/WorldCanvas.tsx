import React, { useRef, useState } from "react";
import { GLView } from "expo-gl";
import World from "./classes/World";
import DimensionsTracker from "../components/DimensionsTracker";
import { ReactElementSize } from "../@hooks/web/useDimensions";
import { View } from "react-native";
import SettingsRegion from "./SettingsRegion";
import HotkeysRegion from "./HotkeysRegion";
import ThreeCanvasContexts from "./ThreeCanvasContexts";
import useGestures from "./canvasHooks/useGestures";
import useKeyMaps from "./canvasHooks/useKeyMaps";
import useThreeStats from "./canvasHooks/useThreeStats";
import useResize from "./canvasHooks/useResize";

interface WorldCanvasProps {
  world?: World;
}

const WorldCanvas = ({ world: propWorld }: WorldCanvasProps) => {
  // instantiate states
  const containerRef = useRef<View>(null);
  const [world] = useState<World>(propWorld || new World());
  const [dimensions, setDimensions] = useState<ReactElementSize>();

  // connect dom gestures to the world
  useGestures(world);
  // connect dom key press events to the world
  useKeyMaps(world);
  // connect world's stats to the dom
  useThreeStats(world, containerRef);
  // connect dom's resize events to the world
  useResize(world, dimensions);

  return (
    <View ref={containerRef} style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={(gl) => (world.gl = gl)} />
      {world && <SettingsRegion world={world} />}
      {world && <HotkeysRegion world={world} />}
      <DimensionsTracker onResize={setDimensions} />
    </View>
  );
};

interface WorldCanvasWrapperProps {
  world?: World;
}

export default ({ world }: WorldCanvasWrapperProps) => {
  return (
    <ThreeCanvasContexts>
      <WorldCanvas world={world} />
    </ThreeCanvasContexts>
  );
};
