import hotkeys, { commands } from "../hotkeys";
import World from "./World";

export default class KeyMap {
  protected world: World;
  protected hotkeys: Hotkeys;
  protected hotkeyCommands: HotkeyCommands;
  [keyCode: string]:
    | boolean
    | ((keyCode: string) => void)
    | ((hotkeys: Hotkeys) => void)
    | ((hotkeyCommands: HotkeyCommands) => void)
    | ((command: string, hotkey: string) => void)
    | World
    | Hotkeys
    | HotkeyCommands;

  constructor(
    world: World,
    hotkeys?: Hotkeys,
    hotkeyCommands?: HotkeyCommands,
  ) {
    this.world = world;
    this.hotkeys = hotkeys || {};
    this.hotkeyCommands = hotkeyCommands || {};
  }

  getHotkeys() {
    return this.hotkeys;
  }

  setHotkeys(hotkeys: Hotkeys) {
    this.hotkeys = hotkeys;
  }

  setHotkeyByCommand(command: string, hotkey: string) {
    this.hotkeys[command] = hotkey;
  }

  getHotkeyCommands() {
    return this.hotkeyCommands;
  }

  setHotkeyCommands(hotkeyCommands: HotkeyCommands) {
    this.hotkeyCommands = hotkeyCommands;
  }

  onKeyDown(keyCode: string) {
    this[keyCode] = true;
  }
  onKeyUp(keyCode: string) {
    delete this[keyCode];
  }

  draw() {
    // if this is not selected, skip all key handlings
    if (this.world.universe && !this.world.isSelected) return;

    // handle keystrokes
    for (const [hotKeyCommand, hotKeyCombos] of Object.entries(hotkeys)) {
      if (
        hotKeyCombos
          .split(",")
          .some((hotKeyCombo) =>
            hotKeyCombo.split("+").every((hkc) => this[hkc]),
          )
      ) {
        commands[hotKeyCommand].onDraw(this.world);
      }
    }
  }
}
