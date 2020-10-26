import React, { useRef } from "react";
import Universe from "./classes/Universe";
import World from "./classes/World";
import ThreeCanvas from "./ThreeCanvas";

const world1 = new World();
const world2 = new World();

export default () => {
  const universe = useRef(new Universe([world1, world2]));
  return (
    <>
      <ThreeCanvas world={world1} />
      <ThreeCanvas world={world2} />
    </>
  );
};
