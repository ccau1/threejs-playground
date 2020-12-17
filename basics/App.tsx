import React, { useCallback, useRef } from "react";
import Universe from "./ThreeCanvas/classes/Universe";
import UniverseComponent from "./ThreeCanvas/Universe";
import * as THREE from "three";
import SettingsRegion from "./ThreeCanvas/components/SettingsRegion";
import { View } from "react-native";
import HotkeysRegion from "./ThreeCanvas/components/HotkeysRegion";
import { setCursorPosition } from "./ThreeCanvas/threeUtils";

export default function App() {
  const _universe = useRef<Universe>();

  const onUniverseCreate = useCallback((universe: Universe) => {
    _universe.current = universe;
    console.log("universe onUniverseCreate", universe);

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

    // draw a cursor
    const cursorGeometry = new THREE.ConeGeometry(0.2, 1, 3);
    const cursorMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const cursor = new THREE.Mesh(cursorGeometry, cursorMaterial);
    universe.addObject("cursor", cursor);

    universe.panels.addPanel({
      _id: "settings",
      render: ({ world }) => {
        return (
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <SettingsRegion world={world} />
          </View>
        );
      },
    });
    universe.panels.addPanel({
      _id: "hotkeys",
      render: ({ world }) => (
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <HotkeysRegion world={world} />
        </View>
      ),
    });
    universe.addWorld(universe.world.clone());

    universe.gestureControls.add({
      name: "cursor",
      priority: 100,
      onHover: ({ touches, world }) => {
        // set cursor position
        // const cursor = world.scene.scene.getObjectByName("cursor");
        cursor && setCursorPosition(touches[0], cursor, world);
      },
    });

    universe.gestureControls.add({
      name: "orbitControl",
      priority: -10,
      onDrag: ({ summary, world }) => {
        const isShiftKeyDown =
          world.keyMap["ShiftLeft"] || world.keyMap["ShiftRight"];
        if (world.camera.type === "OrthographicCamera" || isShiftKeyDown) {
          // pane screen
          // this.paneCamera(summary);
          world.camera.paneDelta(
            summary.dragDeltaInterval.x,
            summary.dragDeltaInterval.y,
          );
        } else {
          // rotate screen
          world.camera.rotateDelta(
            summary.dragDeltaInterval,
            world.camera.isFirstPersonView ? "lookAt" : "camera",
          );
        }
      },
    });

    console.log("set scene init");
  }, []);

  return (
    <>
      <UniverseComponent onUniverseCreate={onUniverseCreate} />
    </>
  );
}
