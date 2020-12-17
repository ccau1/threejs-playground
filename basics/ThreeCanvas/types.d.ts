interface Position2D {
  x: number;
  y: number;
}

interface Position3D {
  x: number;
  y: number;
  z: number;
}

interface HotkeyCommand {
  key: string;
  name: string;
  onDraw(world: World): void;
}

interface HotkeyCommands {
  [key: string]: HotkeyCommand;
}

interface Hotkeys {
  [comobos: string]: string;
}

type CameraEndpoint = "camera" | "lookAt";

type ChildrenElement = CElement<any, any> | CElement<any, any>[];

type CameraType = "PerspectiveCamera" | "OrthographicCamera";

interface MeshPool {
  [key: string]: MeshPoolItem;
}

interface MeshPoolItem {
  id: string;
  object3D: THREE.Object3D;
  entangled: boolean;
}

interface WorldBaseConstructor {
  _id?: string;
  gl?: ExpoWebGLRenderingContext;
  width?: number;
  height?: number;
  initDraw?: boolean;
  pixelRatio?: number;
  universe?: Universe;
  scene?: Scene;
}

interface Worlds {
  [worldId: string]: World;
}

interface PanelConstructor {
  _id: string;
  visible?: boolean;
  render: (opts: PanelRenderProps) => any;
  worldTargets?: WorldTargets;
}

type WorldTargets = Array<string | World>;

interface PanelRenderProps {
  world: World;
}
