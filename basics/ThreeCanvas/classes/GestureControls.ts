import Universe from "./Universe";

export default class GestureControls {
  protected _universe: Universe;
  protected _gestureControls: { [name: string]: GestureControl } = {};
  constructor(universe: Universe) {
    this._universe = universe;
  }

  add(gestureControl: GestureControl) {
    this._gestureControls[gestureControl.name] = gestureControl;
    gestureControl.init?.({ universe: this._universe });
  }

  remove(gestureControl: GestureControl | string) {
    const gestureControlId =
      typeof gestureControl === "string" ? gestureControl : gestureControl.name;
    if (!this._gestureControls[gestureControlId])
      throw new Error("gesture control not found");

    this._gestureControls[gestureControlId].destroy?.({
      universe: this._universe,
    });

    delete this._gestureControls[gestureControlId];
  }

  get controls() {
    return this._gestureControls;
  }
}
