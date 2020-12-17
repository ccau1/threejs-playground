import React, { useRef, useState } from "react";
import { GLView } from "expo-gl";
import World from "./classes/World";
import DimensionsTracker from "../components/DimensionsTracker";
import { ReactElementSize } from "../@hooks/web/useDimensions";
import { View } from "react-native";
import ThreeCanvasContexts from "./ThreeCanvasContexts";
import useGestures from "./canvasHooks/useGestures";
import useKeyMaps from "./canvasHooks/useKeyMaps";
import useThreeStats from "./canvasHooks/useThreeStats";
import useResize from "./canvasHooks/useResize";
import Panel from "./classes/baseClasses/Panel";

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
  // connect world's stats to the dom
  useThreeStats(world, containerRef);
  // connect dom's resize events to the world
  useResize(world, dimensions);

  return (
    <View ref={containerRef} style={{ flex: 1 }}>
      <GLView style={{ flex: 1 }} onContextCreate={(gl) => (world.gl = gl)} />
      <DimensionsTracker onResize={setDimensions} />
    </View>
  );
};

interface WorldCanvasWrapperProps {
  world?: World;
  panels?: Array<Panel>;
}

export default ({ world, panels }: WorldCanvasWrapperProps) => {
  return (
    <ThreeCanvasContexts>
      <WorldCanvas world={world} />
      {panels?.map((panel) => panel.render({ world }))}
    </ThreeCanvasContexts>
  );
};
