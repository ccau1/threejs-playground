import { ExpoWebGLRenderingContext } from "expo-gl";
import ExpoTHREE from "expo-three";
import World from "./World";
import TWEEN from "@tweenjs/tween.js";

export default class Renderer {
  protected _gl: ExpoWebGLRenderingContext;
  protected _renderer: ExpoTHREE.Renderer;
  protected world: World;
  protected isDrawing: boolean = false;

  constructor(world: World, gl: ExpoWebGLRenderingContext) {
    this._gl = gl;
    this._renderer = new ExpoTHREE.Renderer({
      gl,
      antialias: true,
      powerPreference: "high-performance",
    });

    this.world = world;
    this._renderer.setSize(world.width, world.height);
    this._renderer.setPixelRatio(world.pixelRatio);
  }

  get gl() {
    return this._gl;
  }

  set gl(gl: ExpoWebGLRenderingContext) {
    this._gl = gl;
    this._renderer = new ExpoTHREE.Renderer({
      gl,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.setScreenSize(this.world.width, this.world.height);
  }

  get renderer() {
    return this._renderer;
  }

  /**
   *
   * @param width width of screen
   * @param height height of screen
   * @param pixelRatio pixel ratio based on device
   *
   * updates renderer's size and pixel ratio
   */
  setScreenSize(
    width: number,
    height: number,
    pixelRatio: number = window.devicePixelRatio || 1,
  ) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }

  /**
   * render the scene and camera to screen
   */
  render() {
    this.renderer.render(this.world.scene.scene, this.world.camera.camera);
    this.gl.endFrameEXP();
  }

  /**
   * start a looping cycle to keep rendering in each animation frame
   */
  startDrawing() {
    this.isDrawing = true;
    this._drawLoop();
  }

  /**
   * stop a looping cycle for rendering
   */
  stopDrawing() {
    this.isDrawing = false;
  }

  /**
   * a loop that keeps drawing the world's draw function
   * on each animation frame
   */
  protected _drawLoop() {
    requestAnimationFrame((time) => {
      if (!this.isDrawing) return;
      this.world.stats?.begin();
      this.world.draw();
      this.render();
      this.world.stats?.end();
      this._drawLoop();
      TWEEN.update(time);
    });
  }
}
