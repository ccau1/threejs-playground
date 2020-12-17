export default class GestureControls {
  protected _gestureControls: { [name: string]: GestureControl } = {};
  constructor() {}

  add(gestureControl: GestureControl) {
    this._gestureControls[gestureControl.name] = gestureControl;
  }

  remove(gestureControl: GestureControl | string) {
    if (typeof gestureControl === "string") {
      delete this._gestureControls[gestureControl];
    } else {
      delete this._gestureControls[gestureControl.name];
    }
  }

  get controls() {
    return this._gestureControls;
  }
}
