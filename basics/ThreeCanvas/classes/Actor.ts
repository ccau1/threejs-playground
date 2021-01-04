export default class Actor {
  protected _object: THREE.Mesh;

  constructor(id: string, object: THREE.Object3D, opts?: {}) {
    object.name = id;
    this._object = object as THREE.Mesh;
    this._init();
    this.attachEvents();
  }

  get object() {
    return this._object;
  }

  async _init() {
    this.onAwake();
    // ...do some stuff
    this.onEnable();
    // ...do some stuff
    this.onStart();
  }

  attachEvents() {
    this._object.addEventListener("onHoverStart", ({ payload }) =>
      this.onHoverStart(payload),
    );
    this._object.addEventListener("onHoverEnd", ({ payload }) =>
      this.onHoverEnd(payload),
    );
    this._object.addEventListener("onHoverEnd", ({ payload }) =>
      this.onHoverEnd(payload),
    );
    this._object.addEventListener("onTouchDragStart", ({ payload }) =>
      this.onTouchDragStart(payload),
    );
    this._object.addEventListener("onTouchDrag", ({ payload }) =>
      this.onTouchDrag(payload),
    );
    this._object.addEventListener("onTouchDragEnd", ({ payload }) =>
      this.onTouchDragEnd(payload),
    );
  }

  // lifecycle
  onAwake(): void {}
  onEnable(): void {}
  onStart(): void {}
  // onTrigger(): void {}
  onCollision(): void {}
  onHoverStart(event: GestureControlEvent) {}
  onHoverEnd(event: GestureControlEvent) {}
  onHovering(event: GestureControlEvent) {}
  onTouchDragStart(event: GestureControlEvent) {}
  onTouchDrag(event: GestureControlEvent) {}
  onTouchDragEnd(event: GestureControlEvent) {}
  onDestroy(): void {}
}
