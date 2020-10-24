import { ExpoWebGLRenderingContext } from "expo-gl";
import ExpoTHREE from "expo-three";
import World from "./World";
import TWEEN from "@tweenjs/tween.js";

export default class Renderer {
  protected gl: ExpoWebGLRenderingContext;
  protected renderer: ExpoTHREE.Renderer;
  protected world: World;
  protected isDrawing: boolean = false;

  constructor(world: World, gl: ExpoWebGLRenderingContext) {
    this.gl = gl;
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      antialias: true,
      powerPreference: "high-performance",
    });

    this.world = world;
    this.renderer.setSize(world.width, world.height);
    this.renderer.setPixelRatio(world.pixelRatio);
  }

  getRenderer() {
    return this.renderer;
  }

  setGl(gl: ExpoWebGLRenderingContext) {
    this.gl = gl;
    this.renderer = new ExpoTHREE.Renderer({ gl });
    this.setScreenSize(this.world.width, this.world.height);
  }

  setScreenSize(
    width: number,
    height: number,
    pixelRatio: number = window.devicePixelRatio || 1,
  ) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(pixelRatio);
  }

  render() {
    this.renderer.render(
      this.world.getScene().getScene(),
      this.world.getCamera().getCamera(),
    );
    this.gl.endFrameEXP();
  }

  startDrawing() {
    this.isDrawing = true;
    this._drawLoop();
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  protected _drawLoop() {
    requestAnimationFrame((time) => {
      if (!this.isDrawing) return;
      this.world.getStats().begin();
      this.world.draw();
      this.render();
      this.world.getStats().end();
      this._drawLoop();
      TWEEN.update(time);
    });
  }
}
