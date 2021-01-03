import * as THREE from "three";
import World from "./World";
import PhysicsWorld from "./PhysicsWorld";
import Actor from "./Actor";

export default class Scene {
  protected _scene: THREE.Scene = new THREE.Scene();
  protected _meshPool: MeshPool = {};
  protected world: World;
  protected physicsWorld: PhysicsWorld;

  constructor(world: World) {
    this.world = world;
    this.physicsWorld = new PhysicsWorld(this);
  }

  get scene() {
    return this._scene;
  }

  get meshPool() {
    return this._meshPool;
  }

  /**
   *
   * @param deltaTime delta time since last render
   *
   * handle any rendering needs plugged into scene
   */
  render(deltaTime: number) {
    this.physicsWorld.render(deltaTime);
  }

  /**
   *
   * @param id id of object
   *
   * get object by id
   */
  getObject(id: string) {
    return this.meshPool[id]?.actor;
  }

  /**
   *
   * @param id id of object
   * @param object3D object to add
   * @param options options for adding, usually to place inside meshPool
   */
  addObject(
    id: string,
    object3D: THREE.Object3D | Actor,
    options?: { entangled?: boolean },
  ) {
    if (object3D instanceof THREE.Object3D) {
      object3D = new Actor(id, object3D, options);
    }

    // FIXME: if no check, could add scene object again without
    // removing previous one. Also can become redundant in constantly
    // replacing. Only removing check because of cloning, but should
    // update how we add/manage objects in general

    // if (this.meshPool[id]) throw new Error("object already added");
    const opts = {
      entangled: true,
      ...options,
    };

    this.meshPool[id] = {
      id,
      actor: object3D as Actor,
      // if entangled, changes to this item will reverberate
      // through the universe
      entangled: opts.entangled,
    };
    this.scene.add(this.meshPool[id].actor.object);
    return object3D as Actor;
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
      this.scene.remove(this.meshPool[id].actor.object);
      delete this.meshPool[id];
    }
  }
}
