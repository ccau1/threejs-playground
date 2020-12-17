import GestureControls from "./GestureControls";
import Panels from "./Panels";
import Scene from "./Scene";
import World from "./World";

export default class Universe {
  protected _worlds: Worlds = {};
  protected _selectedWorld: string = "";
  protected _panels = new Panels();
  protected _gestureControls = new GestureControls(this);

  constructor(worlds?: Worlds | World[]) {
    if (worlds) {
      if (Array.isArray(worlds)) {
        this._worlds = worlds.reduce<Worlds>((worldObj, world) => {
          worldObj[world._id] = world;
          return worldObj;
        }, {});
      } else {
        this._worlds = worlds || {};
      }

      Object.values(this.worlds).forEach((w) => (w.universe = this));

      this._selectedWorld = Object.values(this.worlds)[0]?._id || "";
    }
  }

  get gestureControls() {
    return this._gestureControls;
  }

  get panels() {
    return this._panels;
  }

  get worlds() {
    return this._worlds;
  }

  get world() {
    return this.selectedWorld as World;
  }

  get selectedWorld() {
    return this._worlds[this._selectedWorld];
  }

  set selectedWorld(selectedWorld: World) {
    this.setSelectedWorld(selectedWorld);
  }

  /**
   *
   * @param selectedWorld selected world object or id
   *
   * set a world as the selected world
   */
  setSelectedWorld(selectedWorld: string | World) {
    const worldId =
      typeof selectedWorld === "string" ? selectedWorld : selectedWorld._id;
    if (!this.worlds[worldId]) throw new Error("selectedWorld does not exists");
    this._selectedWorld = worldId;
  }

  /**
   *
   * @param world the world to add into this universe
   *
   * add world into universe
   */
  addWorld(world: World) {
    // add a world to our universe
    this.worlds[world._id] = world;
    world.universe = this;
  }

  /**
   *
   * @param id id of object
   * @param object object to add
   * @param options options
   *
   * add object to all (or targetted) worlds
   */
  addObject(
    id: string,
    object: THREE.Object3D,
    options?: { targetWorlds?: string[]; entangled?: boolean },
  ) {
    const { targetWorlds, ...addObjectOptions } = options || {};
    // only select worlds specified in targetWorlds or all if none specified
    const targetedWorlds = targetWorlds?.length
      ? Object.keys(this.worlds)
          .filter((w) => targetWorlds?.includes(w))
          .map((w) => this.worlds[w])
      : Object.values(this.worlds);

    // add to selected worlds
    Object.values(targetedWorlds).forEach((w) => {
      w.scene.addObject(id, object, addObjectOptions);
    });
  }

  /**
   *
   * @param id id of object
   * @param targetWorlds worlds to remove (if none passed, targetting all worlds)
   *
   * remove object by id based on targetted (or all) worlds
   */
  removeObject(id: string, targetWorlds?: string[]) {
    // only select worlds specified in targetWorlds or all if none specified
    const targetedWorlds: World[] = targetWorlds?.length
      ? Object.keys(this.worlds)
          .filter((w) => targetWorlds.includes(w))
          .map((w) => this.worlds[w])
      : Object.keys(this.worlds);
    // remove object from all selected worlds
    Object.values(
      Object.values(targetedWorlds).reduce<{ [key: string]: Scene }>(
        (wBucket, w) => {
          wBucket[w.scene.scene.id] = w.scene;
          return wBucket;
        },
        {},
      ),
    ).forEach((w) => w.removeObject(id, { skipEntangled: true }));
  }
}
