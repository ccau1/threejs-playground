import React, { useRef, useState } from "react";
import { GLView } from "expo-gl";
import World from "./classes/World";
import DimensionsTracker from "../components/DimensionsTracker";
import { LayoutRectangle, View } from "react-native";
import useGestures from "./canvasHooks/useGestures";
import useThreeStats from "./canvasHooks/useThreeStats";
import useResize from "./canvasHooks/useResize";
import Panel from "./classes/baseClasses/Panel";
import TouchTrackerContext from "./contexts/TouchTrackerContext";

interface WorldCanvasProps {
  world?: World;
}

const WorldCanvas = ({ world: propWorld }: WorldCanvasProps) => {
  // instantiate states
  const containerRef = useRef<View>(null);
  const [world] = useState<World>(propWorld || new World());
  const [dimensions, setDimensions] = useState<LayoutRectangle>();

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
    <TouchTrackerContext.Provider>
      <WorldCanvas world={world} />
      {panels?.map(({ render: RenderComp }, index) => (
        <RenderComp key={index} world={world} />
      ))}
    </TouchTrackerContext.Provider>
  );
};
