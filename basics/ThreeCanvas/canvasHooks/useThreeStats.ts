import { useEffect } from "react";
import { Platform, View } from "react-native";
import World from "../classes/World";

export default (world: World, dom: React.RefObject<View>) => {
  useEffect(() => {
    if (world) {
      // if platform is html based
      if (Platform.OS === "web" || Platform.OS === "windows") {
        // add stats to dom
        if (world.stats) {
          world.stats.dom.style.position = "absolute";
          (dom.current as any)?.appendChild?.(world.stats.dom);
        }
      }
    }
  }, [world, dom.current]);
};
