import { ExpoWebGLRenderingContext } from "expo-gl";
import Camera from "../Camera";
import Gestures from "../Gestures";
import Renderer from "../Renderer";
import Scene from "../Scene";
import Stats from "stats.js";
import KeyMap from "../KeyMap";
import hotkeys, { commands as hotkeyCommands } from "../../hotkeys";
import { Platform } from "react-native";
import { ObjectID } from "bson";
import Universe from "../Universe";

// prop object orientation to up
// THREE.Object3D.DefaultUp.set(0, 0, 1);

export default class WorldBase {
  public _id: string;
  protected _universe?: Universe;
  protected _camera: Camera;
  protected _scene: Scene;
  protected _renderer?: Renderer;
  protected _width: number;
  protected _height: number;
  public aspectRatio: number;
  public pixelRatio: number;
  public gestures: Gestures;
  public _stats?: Stats;
  protected _keyMap: KeyMap;
  protected _initDraw?: boolean;

  constructor(options?: WorldBaseConstructor) {
    // define options with default values
    const opts: WorldBaseConstructor = {
      initDraw: true,
      _id: new ObjectID().toHexString(),
      ...options,
    };
    this._id = opts._id || new ObjectID().toHexString();
    this._width = opts.width || opts.gl?.drawingBufferWidth || 0;
    this._height = opts.height || opts.gl?.drawingBufferHeight || 0;
    this.pixelRatio = opts.pixelRatio || window.devicePixelRatio || 1;
    this.aspectRatio = this._width / this._height;
    this._initDraw = opts.initDraw;

    this._universe = opts.universe;

    if (Platform.OS === "web" || Platform.OS === "windows") {
      this._stats = new Stats();
      this._stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    }

    // instantiate our classes
    this._scene = new Scene(this);
    this._camera = new Camera(this);
    this.gestures = new Gestures(this);
    this._keyMap = new KeyMap(this, hotkeys, hotkeyCommands);

    if (opts.gl) {
      // define initial setup
      this._renderer = new Renderer(this, opts.gl);
      this.init();
      if (opts.initDraw) {
        this._renderer.startDrawing();
      }
    }
  }

  /**
   * triggers once at initial draw
   */
  init() {
    // implemented in child
  }

  /**
   * triggers on every requestAnimationFrame
   */
  draw() {
    // needs to be implemented by child
    throw new Error("no draw method implemented");
  }

  get isSelected() {
    return !this._universe || this._universe.selectedWorld === this._id;
  }

  get gl(): ExpoWebGLRenderingContext | undefined {
    return this._renderer?.gl;
  }

  set gl(gl: ExpoWebGLRenderingContext | undefined) {
    if (!gl) {
      this._renderer = undefined;
      return;
    }
    // define initial setup
    this._renderer = new Renderer(this, gl);
    this._renderer.setScreenSize(this.width, this.height);
    this.init();
    if (this._initDraw) {
      this._renderer.startDrawing();
    }
  }

  get renderer() {
    return this._renderer;
  }

  get keyMap() {
    return this._keyMap;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }

  get stats() {
    return this._stats;
  }

  get universe(): Universe | undefined {
    return this._universe;
  }

  set universe(universe: Universe | undefined) {
    this._universe = universe;
  }

  /**
   * set this world as universe's selected world
   */
  setAsSelected() {
    if (this.universe) {
      this.universe.selectedWorld = this._id;
    }
  }

  /**
   *
   * @param width width of screen
   * @param height height of screen
   * @param pixelRatio pixel ratio of device
   *
   * set the screen size and pixel ratio
   */
  setScreenSize(
    width: number,
    height: number,
    pixelRatio: number = window.devicePixelRatio || 1,
  ) {
    this._width = width;
    this._height = height;
    this.aspectRatio = this.width / this.height;
    this.pixelRatio = pixelRatio;

    // update dependent fields
    this.camera.setScreenSize(this.width, this.height);
    this.renderer?.setScreenSize(this.width, this.height);
  }
}
