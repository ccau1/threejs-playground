import moveLeft from "./moveLeft";
import moveRight from "./moveRight";
import moveForward from "./moveForward";
import moveBackward from "./moveBackward";
import rotateHeadLeft from "./rotateHeadLeft";
import rotateHeadRight from "./rotateHeadRight";
import rotateHeadUp from "./rotateHeadUp";
import rotateHeadDown from "./rotateHeadDown";

export default {
  moveLeft,
  moveRight,
  moveForward,
  moveBackward,

  rotateHeadLeft,
  rotateHeadRight,
  rotateHeadUp,
  rotateHeadDown,
} as { [command: string]: HotkeyCommand };