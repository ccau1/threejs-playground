import hotkeys, { commands } from "../hotkeys";
import World from "./World";

export default class KeyMap {
  protected world: World;
  protected _hotkeys: Hotkeys;
  protected _hotkeyCommands: HotkeyCommands;
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
    this._hotkeys = hotkeys || {};
    this._hotkeyCommands = hotkeyCommands || {};
  }

  get hotkeys() {
    return this._hotkeys;
  }

  set hotkeys(hotkeys: Hotkeys) {
    this._hotkeys = hotkeys;
  }

  get hotkeyCommands() {
    return this._hotkeyCommands;
  }

  set hotkeyCommands(hotkeyCommands: HotkeyCommands) {
    this._hotkeyCommands = hotkeyCommands;
  }

  /**
   *
   * @param command command name to map to
   * @param hotkey hot key combos to map command to
   *
   * set hotkey combos to a command
   */
  setHotkeyByCommand(command: string, hotkey: string) {
    this.hotkeys[command] = hotkey;
  }

  /**
   *
   * @param keyCode code being pressed down
   *
   * a key down listener. This needs to be connected to an
   * event listener
   */
  onKeyDown(keyCode: string) {
    this[keyCode] = true;
  }

  /**
   *
   * @param keyCode code being released
   *
   * a key up listener. This needs to be connected to an
   * event listener
   */
  onKeyUp(keyCode: string) {
    delete this[keyCode];
  }

  /**
   * trigger all hotkey combos that has matched
   */
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
