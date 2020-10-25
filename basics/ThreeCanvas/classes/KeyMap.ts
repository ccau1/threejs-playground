import hotkeys, { commands } from "../hotkeys";
import World from "./World";

export default class KeyMap {
  protected world: World;
  [keyCode: string]: boolean | ((keyCode: string) => void) | World;

  constructor(world: World) {
    this.world = world;
  }

  onKeyDown(keyCode: string) {
    this[keyCode] = true;
  }
  onKeyUp(keyCode: string) {
    delete this[keyCode];
  }

  draw() {
    // handle keystrokes
    for (const hotKeyCombos of Object.keys(hotkeys)) {
      if (
        hotKeyCombos
          .split(",")
          .some((hotKeyCombo) =>
            hotKeyCombo.split("+").every((hkc) => this[hkc]),
          )
      ) {
        commands[hotkeys[hotKeyCombos]].onDraw(this.world);
      }
    }
  }
}
