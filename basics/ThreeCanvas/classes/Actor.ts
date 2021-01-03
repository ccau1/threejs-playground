export default class Actor {
  protected _object: THREE.Mesh;

  constructor(id: string, object: THREE.Object3D, opts?: {}) {
    object.name = id;
    this._object = object as THREE.Mesh;
    this._connectGestures();
  }

  get object() {
    return this._object;
  }

  _connectGestures() {
    this._object.addEventListener("onHoverStart", ({ payload }) =>
      this.onHoverStart(payload),
    );
    this._object.addEventListener("onHoverEnd", ({ payload }) =>
      this.onHoverEnd(payload),
    );
    this._object.addEventListener("onHoverEnd", ({ payload }) =>
      this.onHoverEnd(payload),
    );
    this._object.addEventListener("onDragStart", ({ payload }) =>
      this.onDragStart(payload),
    );
    this._object.addEventListener("onDrag", ({ payload }) =>
      this.onDrag(payload),
    );
    this._object.addEventListener("onDragEnd", ({ payload }) =>
      this.onDragEnd(payload),
    );
  }

  onHoverStart(event: GestureControlEvent) {}
  onHoverEnd(event: GestureControlEvent) {}
  onHovering(event: GestureControlEvent) {}
  onDragStart(event: GestureControlEvent) {}
  onDrag(event: GestureControlEvent) {}
  onDragEnd(event: GestureControlEvent) {}
}
