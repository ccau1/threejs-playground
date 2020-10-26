import * as THREE from "three";
import World from "./World";

export default class Scene {
  protected _scene: THREE.Scene = new THREE.Scene();
  protected meshPool: MeshPool = {};
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  get scene() {
    return this._scene;
  }

  getObject(id: string) {
    return this.meshPool[id]?.object3D;
  }

  addObject(
    id: string,
    object3D: THREE.Object3D,
    options?: { entangled?: boolean },
  ) {
    if (this.meshPool[id]) throw new Error("object already added");
    const opts = {
      entangled: true,
      ...options,
    };

    object3D.name = id;
    this.meshPool[id] = {
      id,
      object3D,
      // if entangled, changes to this item will reverberate
      // through the universe
      entangled: opts.entangled,
    };
    this.scene.add(object3D);
  }

  removeObject(id: string) {
    this.scene.remove(this.meshPool[id].object3D);
    delete this.meshPool[id];
  }
}
