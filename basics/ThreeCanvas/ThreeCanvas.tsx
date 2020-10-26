import React from "react";
import WorldCanvas from "./WorldCanvas";
import ThreeCanvasContexts from "./ThreeCanvasContexts";
import World from "./classes/World";

interface ThreeCanvasProps {
  world?: World;
}

export default ({ world }: ThreeCanvasProps) => {
  return (
    <ThreeCanvasContexts>
      <WorldCanvas world={world} />
    </ThreeCanvasContexts>
  );
};
