import * as THREE from "three";
import { setCursorPosition } from "../threeUtils";

export default {
  name: "cursor",
  priority: 100,
  init: ({ universe }) => {
    const cursorGeometry = new THREE.ConeGeometry(0.2, 1, 3);
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    universe.addObject("cursor", cursor);
  },
  destroy: ({ universe }) => {
    universe.removeObject("cursor");
  },
  onHover: ({ touches, world }) => {
    // set cursor position
    const cursor = world.scene.scene.getObjectByName("cursor");
    cursor && setCursorPosition(touches[0], cursor, world);
  },
} as GestureControl;
