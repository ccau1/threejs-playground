import { useEffect } from "react";
import { Platform } from "react-native";
import World from "../classes/World";

export default (world: World) => {
  useEffect(() => {
    if (world) {
      // if platform is html based
      if (Platform.OS === "web" || Platform.OS === "windows") {
        // listen for keyboard events
        document.addEventListener(
          "keydown",
          (ev) => world.keyMap.onKeyDown(ev.code),
          true,
        );
        document.addEventListener(
          "keyup",
          (ev) => world.keyMap.onKeyUp(ev.code),
          true,
        );
      }
    }
  }, [world]);
};
