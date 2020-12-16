import React, { useRef } from "react";
import Universe from "./classes/Universe";
import World from "./classes/World";
import WorldCanvas from "./WorldCanvas";
import * as THREE from "three";

const world1 = new World();
const world2 = world1.clone();

export default () => {
  const universe = useRef(new Universe([world1, world2])).current;
  // draw hemisphere light
  const hemisphereLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 1);
  universe.addObject("hemisphereLight", hemisphereLight);

  // draw directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.castShadow = true;
  directionalLight.position.set(10, 50, 50);
  universe.addObject("directionalLight", directionalLight);

  // draw directional light helper
  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    10,
    "#fff",
  );
  universe.addObject("directionalLightHelper", directionalLightHelper);

  // draw axes helper
  const axesHelper = new THREE.AxesHelper();
  universe.addObject("axesHelper", axesHelper);

  // draw ground
  const groundPoints = [
    new THREE.Vector3(-5, 0, -5),
    new THREE.Vector3(5, 0, -5),
    new THREE.Vector3(5, 0, 5),
    new THREE.Vector3(-5, 0, 5),
  ];
  const shape = new THREE.Shape(
    groundPoints.map((p) => new THREE.Vector2(p.x, p.z)),
  );
  const groundGeometry = new THREE.ShapeBufferGeometry(shape);
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: "#fff",
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotateX(-Math.PI * 0.5);
  ground.position.y = -0.01;
  universe.addObject("ground", ground);

  // draw box
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0);
  cube.receiveShadow = true;
  universe.addObject("cube01", cube);
  console.log("set scene init");

  // draw a cursor
  const cursorGeometry = new THREE.ConeGeometry(0.2, 1, 3);
  const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
  universe.addObject("cursor", cursor);

  return (
    <>
      <WorldCanvas world={world1} />
      <WorldCanvas world={world2} />
    </>
  );
};
