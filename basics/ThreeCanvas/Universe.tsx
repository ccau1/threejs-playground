import React, { useEffect, useRef, useState } from "react";
import useKeyMaps from "./canvasHooks/useKeyMaps";
import Panel from "./classes/baseClasses/Panel";
import Universe from "./classes/Universe";
import World from "./classes/World";
import WorldCanvas from "./WorldCanvas";

interface UniverseProps {
  universe?: Universe;
  onUniverseCreate?: (universe: Universe) => void | Promise<void>;
}

export default ({
  universe: universeProp = new Universe([new World()]),
  onUniverseCreate,
}: UniverseProps) => {
  const universe = useRef(universeProp).current;
  const [instantiated, setInstantiated] = useState(false);

  useEffect(() => {
    (async () => {
      await onUniverseCreate?.(universe);
      setInstantiated(true);
    })();
  }, []);

  // connect dom key press events to the world
  useKeyMaps(universe);

  if (!instantiated) return null;

  return (
    <>
      {Object.values(universe.worlds).map((world: World) => (
        <WorldCanvas
          key={world._id}
          world={world}
          panels={Object.values(universe.panels.panels).filter(
            (p: Panel) =>
              !p.worldTargets?.length ||
              p.worldTargets.some((wt) =>
                typeof wt === "string" ? world._id === wt : world === wt,
              ),
          )}
        />
      ))}
    </>
  );
};
