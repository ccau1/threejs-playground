import { useEffect } from "react";
import { ReactElementSize } from "../../@hooks/web/useDimensions";
import World from "../classes/World";

export default (world: World, dimensions?: ReactElementSize) => {
  // update screen size
  useEffect(() => {
    if (world && dimensions && dimensions.width > 0 && dimensions.height > 0) {
      world.setScreenSize(dimensions.width, dimensions.height);
    }
  }, [world, dimensions]);
};
