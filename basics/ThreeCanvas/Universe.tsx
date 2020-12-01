import React, { useRef } from "react";
import Universe from "./classes/Universe";
import World from "./classes/World";
import WorldCanvas from "./WorldCanvas";

const world1 = new World();
const world2 = world1.clone();

export default () => {
  const universe = useRef(new Universe([world1, world2]));
  return (
    <>
      <WorldCanvas world={world1} />
      <WorldCanvas world={world2} />
    </>
  );
};
