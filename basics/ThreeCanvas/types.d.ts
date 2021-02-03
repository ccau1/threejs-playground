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
  actor: Actor;
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

interface GestureControl {
  name: string;
  priority: number;
  worldTargets?: Array<string | World>;
  onHover?: (event: GestureControlEvent) => void;
  onDragStart?: (event: GestureControlEvent) => void;
  onDrag?: (event: GestureControlEvent) => void;
  onDragEnd?: (event: GestureControlEvent) => void;
  onDoubleTap?: (event: GestureControlEvent) => void;
  onMouseScroll?: (event: GestureControlEvent) => void;
  init?: (options: GestureControlInitOptions) => void;
  destroy?: (options: GestureControlDestroyOptions) => void;
  [type: GestureControlType]: (event: GestureControlEvent) => void;
}

interface GestureControlInitOptions {
  universe: Universe;
}

interface GestureControlDestroyOptions {
  universe: Universe;
}

type GestureControlType =
  | "onHover"
  | "onDragStart"
  | "onDrag"
  | "onDragEnd"
  | "onDoubleTap"
  | "onMouseScroll";

interface GestureControlEvent {
  touches: TouchTrackerEvent[];
  summary: TouchSummary;
  world: World;
  stopPropagation: () => void;
  intersections: THREE.Intersection[];
  originalIntersections: THREE.Intersection[];
}
