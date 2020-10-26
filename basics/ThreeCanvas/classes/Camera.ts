import * as THREE from "three";
import { rotateEndpoint } from "../math";
import World from "./World";
import TWEEN from "@tweenjs/tween.js";

export default class Camera {
  protected type: CameraType = "PerspectiveCamera";
  protected _camera: THREE.Camera;
  protected _position: Position3D = { x: 0, y: 10, z: 0 };
  protected _lookAt: Position3D = { x: 0, y: 0, z: 0 };
  protected world: World;
  protected near: number = 0.1;
  protected far: number = 1000;
  protected zoom: number = 1;
  // speed of camera movements
  protected speed: number = 1;
  protected isFirstPersonView: boolean = false;
  protected firstPersonViewHeight = 0.5;

  constructor(world: World, camera?: THREE.Camera) {
    this.world = world;
    this._camera = camera || this.createCamera();
  }

  setCamera(camera: THREE.Camera) {
    this._camera = camera;
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }

  getFirstPersonViewHeight() {
    return this.firstPersonViewHeight;
  }

  setFirstPersonViewHeight(firstPersonViewHeight: number) {
    this.firstPersonViewHeight = firstPersonViewHeight;
    if (this.isFirstPersonView) {
      this._position.y = firstPersonViewHeight;
    }
    this.lookAt.y = firstPersonViewHeight;
    this.syncPosition();
  }

  getIsFirstPersonView() {
    return this.isFirstPersonView;
  }

  setIsFirstPersonView(isFirstPersonView: boolean) {
    const hasChanged = isFirstPersonView !== this.isFirstPersonView;
    this.isFirstPersonView = isFirstPersonView;
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

  getZoom() {
    return this.zoom;
  }

  setZoom(zoom: number) {
    this.setPosition({ zoom });
  }

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
      this.zoom = pos.zoom;
    }

    this.syncPosition();
  }

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

  get position() {
    return this._position;
  }

  get lookAt() {
    return this._lookAt;
  }

  getLookAt() {
    return this.lookAt;
  }

  paneDelta(x: number, y: number) {
    const damper = 100 / this.speed;

    const originalPos = { ...this.camera.position };

    this.camera.translateX(-x / this.zoom / damper);
    this.camera.translateY(y / this.zoom / damper);
    if (this.type === "PerspectiveCamera") {
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

  setType(type: CameraType) {
    if (this.type === type) return;

    this.type = type;

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

  getType() {
    return this.type;
  }

  setScreenSize(width: number, height: number) {
    this._camera = this.createCamera();
  }

  get camera() {
    return this._camera;
  }

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

    return camera;
  }
}
