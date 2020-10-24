import * as THREE from 'three';
import World from './World';

export default class Scene {
  protected scene: THREE.Scene = new THREE.Scene();
  protected meshPool: MeshPool = {};
  protected world: World;

  constructor(world: World) {
    this.world = world;
  }

  getScene() {
    return this.scene;
  }

  getObject(id: string) {
    return this.meshPool[id]?.object3D;
  }

  addObject(id: string, object3D: THREE.Object3D) {
    if (this.meshPool[id]) throw new Error('object already added');

    object3D.name = id;
    this.meshPool[id] = {
      id,
      object3D
    };
    this.scene.add(object3D);
  }

  removeSceneObject(id: string) {
    this.scene.remove(this.meshPool[id].object3D);
    delete this.meshPool[id];
  }
}