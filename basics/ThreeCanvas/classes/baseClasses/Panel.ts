import World from "../World";

export default class Panel {
  protected _visible: boolean;
  protected _render: (props: PanelRenderProps) => any;
  protected __id: string;
  protected _worldTargets: Array<string | World>;

  constructor({ _id, render, visible, worldTargets }: PanelConstructor) {
    this._render = render;
    this._visible = visible || true;
    this.__id = _id;
    this._worldTargets = worldTargets || [];
  }

  get _id() {
    return this.__id;
  }

  get worldTargets() {
    return this._worldTargets;
  }

  get visible() {
    return this._visible;
  }

  get render() {
    return this._render;
  }
}
