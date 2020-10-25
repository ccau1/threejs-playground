import { ExpoWebGLRenderingContext } from "expo-gl";
import Camera from "../Camera";
import Gestures from "../Gestures";
import Renderer from "../Renderer";
import Scene from "../Scene";
import Stats from "stats.js";
import KeyMap from "../KeyMap";
import hotkeys, { commands as hotkeyCommands } from "../../hotkeys";
import { Platform } from "react-native";

// prop object orientation to up
// THREE.Object3D.DefaultUp.set(0, 0, 1);

export default class WorldBase {
  protected camera: Camera;
  protected scene: Scene;
  protected renderer: Renderer;
  public width: number;
  public height: number;
  public aspectRatio: number;
  public pixelRatio: number;
  public gestures: Gestures;
  public stats?: Stats;
  protected keyMap: KeyMap;

  constructor(options: {
    gl: ExpoWebGLRenderingContext;
    initDraw?: boolean;
    pixelRatio?: number;
  }) {
    // define options with default values
    const opts = {
      initDraw: true,
      ...options,
    };
    this.width = opts.gl.drawingBufferWidth;
    this.height = opts.gl.drawingBufferHeight;
    this.pixelRatio = opts.pixelRatio || window.devicePixelRatio || 1;
    this.aspectRatio = this.width / this.height;

    if (Platform.OS === "web" || Platform.OS === "windows") {
      this.stats = new Stats();
      this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    }

    // instantiate our classes
    this.scene = new Scene(this);
    this.camera = new Camera(this);
    this.gestures = new Gestures(this);
    this.renderer = new Renderer(this, opts.gl);
    this.keyMap = new KeyMap(this, hotkeys, hotkeyCommands);

    // define initial setup
    this.init();
    if (opts.initDraw) {
      this.renderer.startDrawing();
    }
  }

  init() {
    // implemented in child
  }

  draw() {
    // needs to be implemented by child
    throw new Error("no draw method implemented");
  }

  getKeyMap() {
    return this.keyMap;
  }

  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getStats() {
    return this.stats;
  }

  setScreenSize(
    width: number,
    height: number,
    pixelRatio: number = window.devicePixelRatio || 1,
  ) {
    this.width = width;
    this.height = height;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = pixelRatio;

    // update dependent fields
    this.camera.setScreenSize(this.width, this.height);
    this.renderer.setScreenSize(this.width, this.height);
  }

  setGl(gl: ExpoWebGLRenderingContext) {
    this.renderer.setGl(gl);
  }
}
