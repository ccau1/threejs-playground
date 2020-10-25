import moveLeft from "./moveLeft";
import moveRight from "./moveRight";
import moveForward from "./moveForward";
import moveBackward from "./moveBackward";
import rotateHeadLeft from "./rotateHeadLeft";
import rotateHeadRight from "./rotateHeadRight";
import rotateHeadUp from "./rotateHeadUp";
import rotateHeadDown from "./rotateHeadDown";
import toggleFPV from "./toggleFPV";

export default {
  moveLeft,
  moveRight,
  moveForward,
  moveBackward,

  rotateHeadLeft,
  rotateHeadRight,
  rotateHeadUp,
  rotateHeadDown,

  toggleFPV,
} as { [command: string]: HotkeyCommand };
