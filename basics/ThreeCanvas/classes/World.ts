import { ExpoWebGLRenderingContext } from "expo-gl";
import WorldBase from "./baseClasses/WorldBase";
import * as THREE from "three";
import { Vector3 } from "three";

export default class World extends WorldBase {
  constructor(opts: { gl: ExpoWebGLRenderingContext; initDraw?: boolean }) {
    super(opts);
  }

  init() {
    this.camera.setPosition({
      position: { x: 0, y: 10, z: 0 },
      lookAt: { x: 0, y: 0, z: 0 },
    });
    this.renderer.getRenderer().setClearColor("#e6f9ff");

    // draw hemisphere light
    const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
    this.scene.addObject("hemisphereLight", hemisphereLight);

    // draw directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.castShadow = true;
    directionalLight.position.set(10, 50, 50);
    this.scene.addObject("directionalLight", directionalLight);

    // draw directional light helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      10,
      "#fff",
    );
    this.scene.addObject("directionalLightHelper", directionalLightHelper);

    // draw axes helper
    const axesHelper = new THREE.AxesHelper(50);
    this.scene.addObject("axesHelper", axesHelper);

    // draw ground
    const groundPoints = [
      new Vector3(-5, 0, -5),
      new Vector3(5, 0, -5),
      new Vector3(5, 0, 5),
      new Vector3(-5, 0, 5),
    ];
    const shape = new THREE.Shape(
      groundPoints.map((p) => new THREE.Vector2(p.x, p.z)),
    );
    const groundGeometry = new THREE.ShapeBufferGeometry(shape);
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: "#fff",
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    // ground.rotateX(85);
    ground.rotateX(-Math.PI * 0.5);
    ground.position.y = -0.01;
    this.scene.addObject("ground", ground);

    // draw box
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.receiveShadow = true;
    this.scene.addObject("cube01", cube);
    console.log("set scene init");
  }

  draw() {
    // implement draw handling
    console.log("drawing");

    // handle keystrokes
    const keySpeed = 10;
    if (this.keyMap["KeyA"]) {
      this.camera.paneDelta(keySpeed, 0);
    }
    if (this.keyMap["KeyD"]) {
      this.camera.paneDelta(-keySpeed, 0);
    }
    if (this.keyMap["KeyW"]) {
      this.camera.paneDelta(0, keySpeed);
    }
    if (this.keyMap["KeyS"]) {
      this.camera.paneDelta(0, -keySpeed);
    }

    if (this.keyMap["ArrowLeft"]) {
      this.camera.rotateDelta({ x: keySpeed, y: 0 }, "lookAt");
    }
    if (this.keyMap["ArrowRight"]) {
      this.camera.rotateDelta({ x: -keySpeed, y: 0 }, "lookAt");
    }
    if (this.keyMap["ArrowUp"]) {
      this.camera.rotateDelta({ x: 0, y: keySpeed }, "lookAt");
    }
    if (this.keyMap["ArrowDown"]) {
      this.camera.rotateDelta({ x: 0, y: -keySpeed }, "lookAt");
    }
  }
}
