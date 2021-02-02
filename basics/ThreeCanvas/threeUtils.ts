import * as THREE from "three";
import World from "./classes/World";

const rayCaster = new THREE.Raycaster();
let intersections: THREE.Intersection[] = [];

export const raycastIntersection = (
  position: Position2D,
  dimensions: { width: number; height: number },
  camera: THREE.Camera,
  objects: THREE.Object3D[],
) => {
  const x = (position.x / dimensions.width) * 2 - 1;
  const y = -(position.y / dimensions.height) * 2 + 1;
  rayCaster.setFromCamera({ x: x, y: y }, camera);
  intersections = rayCaster.intersectObjects(objects, true);
  return intersections;
};

export const setCursorPosition = (
  mousePosition: { x: number; y: number },
  cursor: THREE.Object3D,
  world: World,
  children: THREE.Object3D[] = world.scene.scene.children,
) => {
  const intersections = raycastIntersection(
    mousePosition,
    world,
    world.camera.camera,
    children,
  );

  cursor?.position.set(
    intersections[0]?.point.x || 0,
    0,
    intersections[0]?.point.z || 0,
  );
};

export const screenDeltaToRealWorld = (
  screenDelta: Position2D,
  camera: THREE.Camera,
  speed: number = 1,
) => {
  // clone camera position to an object
  let tempCamera = new THREE.Object3D();
  // set temp camera's position
  tempCamera.position.set(
    camera.position.x,
    camera.position.y,
    camera.position.z,
  );
  // set temp camera's lookat position
  var lookAtVector = new THREE.Vector3(0, 0, 1);
  lookAtVector.applyQuaternion(camera.quaternion);
  tempCamera.lookAt(lookAtVector);

  // get whether camera is looking directly at the ground
  const isLookingGround =
    Math.floor(camera.position.x * 10000) ===
      Math.floor(lookAtVector.x * 10000) &&
    Math.floor(camera.position.z * 10000) ===
      Math.floor(lookAtVector.z * 10000);

  // move temp camera's position based on screen delta x & y
  tempCamera.translateX(screenDelta.x * speed * (isLookingGround ? -1 : 1));
  tempCamera.translateY(screenDelta.y * speed * (isLookingGround ? -1 : 1));
  tempCamera.translateZ(screenDelta.y * speed * (isLookingGround ? -1 : 1));

  // return translated delta XYZ
  return {
    x: camera.position.x - tempCamera.position.x,
    y: camera.position.y - tempCamera.position.y,
    z: camera.position.z - tempCamera.position.z,
  };
};
