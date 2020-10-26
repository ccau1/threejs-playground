import World from "./World";

export default class Universe {
  protected worlds: Worlds = {};
  protected _selectedWorld: string = "";

  constructor(worlds?: Worlds | World[]) {
    if (worlds) {
      if (Array.isArray(worlds)) {
        this.worlds = worlds.reduce<Worlds>((worldObj, world) => {
          worldObj[world._id] = world;
          return worldObj;
        }, {});
      } else {
        this.worlds = worlds || {};
      }

      Object.values(this.worlds).forEach((w) => (w.universe = this));

      this._selectedWorld = Object.values(this.worlds)[0]?._id || "";
    }
  }

  get selectedWorld() {
    return this._selectedWorld;
  }

  set selectedWorld(selectedWorld: string) {
    if (!this.worlds[selectedWorld])
      throw new Error("selectedWorld does not exists");
    this._selectedWorld = selectedWorld;
  }

  addWorld(world: World) {
    // add a world to our universe
    this.worlds[world._id] = world;
    world.universe = this;
  }

  addObject(id: string, object: THREE.Object3D, targetWorlds?: string[]) {
    // only select worlds specified in targetWorlds or all if none specified
    const targetedWorlds = targetWorlds?.length
      ? Object.keys(this.worlds)
          .filter((w) => targetWorlds.includes(w))
          .map((w) => this.worlds[w])
      : Object.keys(this.worlds);
    // add to selected worlds
    Object.values(targetedWorlds).forEach((w) =>
      w.scene.addObject(id, object, {}),
    );
  }

  removeObject(id: string, targetWorlds?: string[]) {
    // only select worlds specified in targetWorlds or all if none specified
    const targetedWorlds = targetWorlds?.length
      ? Object.keys(this.worlds)
          .filter((w) => targetWorlds.includes(w))
          .map((w) => this.worlds[w])
      : Object.keys(this.worlds);
    // remove object from all selected worlds
    Object.values(targetedWorlds).forEach((w) => w.scene.removeObject(id));
  }
}
