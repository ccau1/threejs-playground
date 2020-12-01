import World from "./World";
import Ammo from "ammojs-typed";
import Scene from "./Scene";

export default class PhysicsWorld {
  protected scene: Scene;
  protected ammo?: typeof Ammo;
  protected physicsWorld?: Ammo.btDiscreteDynamicsWorld;

  constructor(scene: Scene) {
    this.scene = scene;
    Ammo().then((ammo) => {
      this.ammo = ammo;
      this.setupPhysicsWorld();
    });
  }

  /**
   *
   * @param deltaTime delta time since last render
   *
   * go through each object in the scene and update
   * transform based on ammo
   */
  render(deltaTime: number) {
    // Step world
    this.physicsWorld?.stepSimulation(deltaTime, 10);

    let tmpTrans: Ammo.btTransform | undefined = undefined;

    // Update rigid bodies
    for (const [_id, meshItem] of Object.entries(this.scene.meshPool)) {
      let objThree = meshItem.object3D;
      if (!objThree.userData.physicsBody) continue;
      let objAmmo = objThree.userData.physicsBody;
      let ms = objAmmo.getMotionState();
      if (ms) {
        ms.getWorldTransform(tmpTrans);
        let p = tmpTrans!.getOrigin();
        let q = tmpTrans!.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }

  /**
   * setup the basic environment in the physics world
   */
  setupPhysicsWorld() {
    let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
      dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
      overlappingPairCache = new Ammo.btDbvtBroadphase(),
      solver = new Ammo.btSequentialImpulseConstraintSolver();

    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      overlappingPairCache,
      solver,
      collisionConfiguration,
    );
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
  }
}
