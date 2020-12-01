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

  /**
   *
   * @param id id of object
   *
   * get object by id
   */
  getObject(id: string) {
    return this.meshPool[id]?.object3D;
  }

  /**
   *
   * @param id id of object
   * @param object3D object to add
   * @param options options for adding, usually to place inside meshPool
   */
  addObject(
    id: string,
    object3D: THREE.Object3D,
    options?: { entangled?: boolean },
  ) {
    // FIXME: if no check, could add scene object again without
    // removing previous one. Also can become redundant in constantly
    // replacing. Only removing check because of cloning, but should
    // update how we add/manage objects in general

    // if (this.meshPool[id]) throw new Error("object already added");
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

  /**
   *
   * @param id id of the object
   * @param opts options for deleting object
   *
   * if user did not specify skipping entanglement and
   * this item is entangled, call universe to remove object
   * in all worlds. Else, handle deleting in this scene now
   */
  removeObject(id: string, opts?: { skipEntangled?: boolean }) {
    // if user did not specify skipping entanglement and
    // this item is entangled, call universe to remove object
    // in all worlds.
    if (!opts?.skipEntangled && this.meshPool[id].entangled) {
      this.world.universe?.removeObject(id);
    } else {
      this.scene.remove(this.meshPool[id].object3D);
      delete this.meshPool[id];
    }
  }
}
