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

    // draw ground
    const groundPoints = [
      // top left
      new THREE.Vector3(-500, 0, -500),
      // top right
      new THREE.Vector3(500, 0, -500),
      // bottom right
      new THREE.Vector3(500, 0, 500),
      // bototm left
      new THREE.Vector3(-500, 0, 500),
    ];
    const groundShape = new THREE.Shape(
      groundPoints.map((p) => new THREE.Vector2(p.x, p.z)),
    );
    const groundGeometry = new THREE.ShapeBufferGeometry(groundShape);
    const groundMaterial = new THREE.MeshStandardMaterial({
      opacity: 0,
      transparent: true,
      side: THREE.FrontSide,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotateX(-Math.PI * 0.5);
    ground.position.y = -0.02;
    universe.addObject("cursorGround", ground);
  },
  destroy: ({ universe }) => {
    universe.removeObject("cursor");
  },
  onHover: ({ touches, world }) => {
    // set cursor position
    const cursor = world.scene.scene.getObjectByName("cursor");
    const cursorGround = world.scene.scene.getObjectByName("cursorGround");
    cursor && setCursorPosition(touches[0], cursor, world, [cursorGround]);
  },
  onDrag: ({ touches, world }) => {
    // set cursor position
    const cursor = world.scene.scene.getObjectByName("cursor");
    const cursorGround = world.scene.scene.getObjectByName("cursorGround");
    cursor && setCursorPosition(touches[0], cursor, world, [cursorGround]);
  },
} as GestureControl;
