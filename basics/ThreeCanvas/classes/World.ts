import WorldBase from "./baseClasses/WorldBase";
import * as THREE from "three";

export default class World extends WorldBase {
  constructor(opts?: WorldBaseConstructor) {
    super(opts);
  }

  /**
   * triggers once at initial draw
   */
  init() {
    this.camera.setPosition({
      position: { x: 0, y: 10, z: 0 },
      lookAt: { x: 0, y: 0, z: 0 },
    });
    this._renderer?.renderer.setClearColor("#e6f9ff");
  }

  /**
   * triggers on every requestAnimationFrame
   */
  draw() {
    // implement draw handling

    // trigger keymap draw
    this.keyMap.draw();
  }
}
