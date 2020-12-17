import { useEffect } from "react";
import { Platform } from "react-native";
import Universe from "../classes/Universe";

export default (universe: Universe) => {
  useEffect(() => {
    if (universe) {
      // if platform is html based
      if (Platform.OS === "web" || Platform.OS === "windows") {
        // listen for keyboard events
        document.addEventListener(
          "keydown",
          (ev) => universe.selectedWorld.keyMap.onKeyDown(ev.code),
          true,
        );
        document.addEventListener(
          "keyup",
          (ev) => universe.selectedWorld.keyMap.onKeyUp(ev.code),
          true,
        );
      }
    }
  }, [universe]);
};
