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
  onDraw(world: World): void;
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
}
