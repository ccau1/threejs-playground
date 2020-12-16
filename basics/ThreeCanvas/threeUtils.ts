import * as THREE from "three";
import World from "./classes/World";

export const setCursorPosition = (
  mousePosition: { x: number; y: number },
  cursor: THREE.Object3D,
  world: World,
) => {
  const rayCaster = new THREE.Raycaster();
  let intersections: THREE.Intersection[] = [];
  const x = (mousePosition.x / world.width) * 2 - 1;
  const y = -(mousePosition.y / world.height) * 2 + 1;
  rayCaster.setFromCamera({ x: x, y: y }, world.camera.camera);
  intersections = rayCaster.intersectObjects(world.scene.scene.children, true);

  cursor?.position.set(
    intersections[0]?.point.x || 0,
    0,
    intersections[0]?.point.z || 0,
  );
};
