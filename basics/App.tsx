import React, { useCallback } from "react";
import Universe from "./ThreeCanvas/classes/Universe";
import UniverseComponent from "./ThreeCanvas/Universe";
import * as THREE from "three";
import SettingsRegion from "./ThreeCanvas/components/SettingsRegion";
import { View } from "react-native";
import HotkeysRegion from "./ThreeCanvas/components/HotkeysRegion";
import { orbitControl, cursor } from "./ThreeCanvas/gestureControls";

export default function App() {
  const onUniverseCreate = useCallback((universe: Universe) => {
    console.log("universe onUniverseCreate", universe);

    // gesture control for cursor display
    universe.gestureControls.add(cursor);
    // gesture control for panning/rotating camera
    universe.gestureControls.add(orbitControl);

    universe.addWorld(universe.world.clone());

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

    console.log("set scene init");
  }, []);

  return (
    <>
      <UniverseComponent onUniverseCreate={onUniverseCreate} />
    </>
  );
}
