import * as THREE from "three";
import { rotateEndpoint } from "../math";
import World from "./World";
import TWEEN from "@tweenjs/tween.js";

export default class Camera {
  protected _type: CameraType = "PerspectiveCamera";
  protected _camera: THREE.Camera;
  protected _position: Position3D = { x: 0, y: 10, z: 0 };
  protected _lookAt: Position3D = { x: 0, y: 0, z: 0 };
  protected world: World;
  protected near: number = 0.1;
  protected far: number = 1000;
  protected _zoom: number = 1;
  // speed of camera movements
  protected _speed: number = 1;
  protected _isFirstPersonView: boolean = false;
  protected _firstPersonViewHeight = 0.5;

  constructor(world: World, camera?: THREE.Camera) {
    this.world = world;
    if (camera) {
      this._camera = this.camera = camera;
    } else {
      this._camera = this.createCamera();
    }
  }

  attachEvents(camera: THREE.Camera) {
    camera.addEventListener(
      "onTouchDrag",
      ({ payload: ev }: THREE.Event & { payload: GestureControlEvent }) => {
        this.onTouchDrag(ev);
      },
    );
    camera.addEventListener(
      "onMouseScroll",
      ({ payload: ev }: THREE.Event & { payload: GestureControlEvent }) => {
        this.onMouseScroll(ev);
      },
    );
  }

  get camera() {
    return this._camera;
  }

  set camera(camera: THREE.Camera) {
    this._camera = camera;
    this.attachEvents(camera);
  }

  get speed() {
    return this._speed;
  }

  set speed(speed: number) {
    this._speed = speed;
  }

  get position() {
    return this._position;
  }

  get lookAt() {
    return this._lookAt;
  }

  get firstPersonViewHeight() {
    return this._firstPersonViewHeight;
  }

  set firstPersonViewHeight(firstPersonViewHeight: number) {
    this._firstPersonViewHeight = firstPersonViewHeight;
    if (this.isFirstPersonView) {
      this._position.y = firstPersonViewHeight;
    }
    this.lookAt.y = firstPersonViewHeight;
    this.syncPosition();
  }

  get zoom() {
    return this._zoom;
  }

  set zoom(zoom: number) {
    this.setPosition({ zoom });
  }

  get isFirstPersonView() {
    return this._isFirstPersonView;
  }

  set isFirstPersonView(isFirstPersonView: boolean) {
    const hasChanged = isFirstPersonView !== this._isFirstPersonView;
    this._isFirstPersonView = isFirstPersonView;
    // TODO: need to handle animation
    if (hasChanged) {
      // define new camera position
      const newCameraPosition = isFirstPersonView
        ? { ...this.lookAt, y: this.firstPersonViewHeight }
        : { ...this._position, y: 10 };
      // define new camera look at position
      const newCameraLookAt = isFirstPersonView
        ? { ...this.lookAt, z: 10 }
        : { ...this._position, y: this.firstPersonViewHeight };

      // move camera
      new TWEEN.Tween(this._position)
        // Move to new position in 1 second.
        .to(newCameraPosition, 1000)
        // Use an easing function to make the animation smooth.
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.syncPosition();
        })
        .start();

      // move lookAt
      new TWEEN.Tween(this.lookAt)
        // Move to new position in 1 second.
        .to(newCameraLookAt, 1000)
        // Use an easing function to make the animation smooth.
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => this.syncPosition())
        .start();
    }
  }

  get type() {
    return this._type;
  }

  set type(type: CameraType) {
    if (this._type === type) return;

    this._type = type;

    if (this.type === "OrthographicCamera") {
      if (this.isFirstPersonView) {
        this._position = { ...this.position, y: 10 };
        this._lookAt = { ...this.position, y: this.firstPersonViewHeight };
      } else {
        this._position = { ...this.lookAt, y: 10 };
        this._lookAt = { ...this.position, y: this.firstPersonViewHeight };
      }
    } else {
      if (this.isFirstPersonView) {
        this.position.y = this.firstPersonViewHeight;
        this.lookAt.y = this.firstPersonViewHeight;
        this.lookAt.z = 10;
      } else {
      }
    }

    this._camera = this.createCamera();
  }

  onTouchDrag({ summary }: GestureControlEvent) {
    const isShiftKeyDown =
      this.world.keyMap["ShiftLeft"] || this.world.keyMap["ShiftRight"];
    if (this.type === "OrthographicCamera" || isShiftKeyDown) {
      // pane screen
      this.paneDelta(summary.dragDeltaInterval.x, summary.dragDeltaInterval.y);
    } else {
      // rotate screen
      this.rotateDelta(
        summary.dragDeltaInterval,
        this.isFirstPersonView ? "lookAt" : "camera",
      );
    }
  }

  onMouseScroll({ summary }: GestureControlEvent) {
    this.zoomDelta(summary.scaleDeltaInterval);
  }

  /**
   *
   * @param pos new camera position, looking at position and/or zoom
   *
   * to set position of camera based on any of camera's
   * position, look at position and zoom level
   */
  setPosition(pos: {
    position?: Position3D;
    lookAt?: Position3D;
    zoom?: number;
  }) {
    if (pos.position) {
      this._position = pos.position;
    }
    if (pos.lookAt) {
      this._lookAt = pos.lookAt;
    }
    if (pos.zoom) {
      this._zoom = pos.zoom;
    }

    this.syncPosition();
  }

  /**
   *
   * @param posDelta delta of position, lookAt and/or zoom
   *
   * update position based on change in camera position,
   * look at position and/or zoom
   */
  setPositionDelta(posDelta: {
    position?: Position3D;
    lookAt?: Position3D;
    zoom?: number;
  }) {
    const newPosition = {
      x: this._position.x + (posDelta.position?.x || 0),
      y: this._position.y + (posDelta.position?.y || 0),
      z: this._position.z + (posDelta.position?.z || 0),
    };
    const newLookAt = {
      x: this.lookAt.x + (posDelta.lookAt?.x || 0),
      y: this.lookAt.y + (posDelta.lookAt?.y || 0),
      z: this.lookAt.z + (posDelta.lookAt?.z || 0),
    };

    const newZoom = this.zoom + (posDelta.zoom || 0);

    this.setPosition({
      position: newPosition,
      lookAt: newLookAt,
      zoom: newZoom,
    });
  }

  zoomDelta(zoomDelta: number) {
    // scroll can be too fast, so damper it to a medium speed
    const damper = 0.01 * this.speed;
    // create a new camera and translate its Z to zoom
    const newCamera = this.camera.clone();
    newCamera.translateZ(zoomDelta * damper);
    // if new position height is too close to the floor
    if (newCamera.position.y < this._lookAt.y && newCamera.position.y < 50) {
      // don't zoom, just return
      return;
    }

    // set new camera position after zoom
    this.camera.position.x = newCamera.position.x;
    this.camera.position.y = newCamera.position.y;
    this.camera.position.z = newCamera.position.z;
    this._position = {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
    };
  }

  /**
   *
   * @param x change in x (based on 2D space)
   * @param y change in y (based on 2D space)
   *
   * pane screen by x,y delta
   */
  paneDelta(x: number, y: number) {
    const damper = 100 / this.speed;

    const originalPos = { ...this.camera.position };

    this.camera.translateX(-x / this.zoom / damper);
    this.camera.translateY(y / this.zoom / damper);
    if (this._type === "PerspectiveCamera") {
      this.camera.translateZ(-y / this.zoom / damper);
      this.camera.position.y = originalPos.y;
    }
    this.setPosition({
      position: this.camera.position,
      lookAt: {
        x: this.lookAt.x - (originalPos.x - this.camera.position.x),
        y: this.lookAt.y,
        z: this.lookAt.z - (originalPos.z - this.camera.position.z),
      },
    });
  }

  /**
   *
   * @param delta change in vector2D
   * @param cameraEndpoint the endpoint to rotate (the other endpoint being center)
   *
   * rotate an endpoint ("camera" | "lookAt") around the other endpoint as center
   */
  rotateDelta(delta: Position2D, cameraEndpoint: CameraEndpoint) {
    const damper = 1 * this.speed;
    this[cameraEndpoint === "camera" ? "_position" : "_lookAt"] =
      cameraEndpoint === "camera"
        ? // rotate camera around lookAt
          rotateEndpoint(
            this.lookAt,
            this.position,
            { x: delta.x * damper, y: delta.y * damper },
            Math.PI / 2,
          )
        : // rotate lookAt around camera
          rotateEndpoint(
            this.position,
            this.lookAt,
            { x: -delta.x * damper, y: delta.y * damper },
            // Math.PI / 2,
          );

    this.syncPosition();
  }

  /**
   *
   * @param width width of screen
   * @param height height of screen
   *
   * update screen size in camera
   */
  setScreenSize(width: number, height: number) {
    this._camera = this.createCamera();
  }

  /**
   *
   * @param camera three camera (optional)
   *
   * sync camera properties based on stored variables such as
   * position, lookAt and zoom
   */
  syncPosition(camera: THREE.Camera = this.camera) {
    if (this.type === "OrthographicCamera") {
      camera.position.set(this.lookAt.x, this.lookAt.y + 10, this.lookAt.z);
    } else {
      camera.position.set(this.position.x, this.position.y, this.position.z);
    }
    camera.lookAt(this.lookAt.x, this.lookAt.y, this.lookAt.z);
    (camera as any).zoom = this.zoom;
    (camera as any).updateProjectionMatrix();
  }

  /**
   * create camera based on type and sync its position
   */
  protected createCamera() {
    let camera = null;
    switch (this.type) {
      case "PerspectiveCamera":
        camera = new THREE.PerspectiveCamera(
          50,
          this.world.aspectRatio,
          this.near,
          this.far,
        );
        break;
      case "OrthographicCamera":
        camera = new THREE.OrthographicCamera(
          this.world.width / 100 / -2,
          this.world.width / 100 / 2,
          this.world.height / 100 / 2,
          this.world.height / 100 / -2,
          this.near,
          this.far,
        );
        // ensure camera and lookAt is the same
        break;
      default:
        throw new Error("camera type invalid");
    }

    this.syncPosition(camera);

    this.attachEvents(camera);

    return camera;
  }
}
