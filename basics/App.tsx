import React, { useCallback } from "react";
import Universe from "./ThreeCanvas/classes/Universe";
import UniverseComponent from "./ThreeCanvas/Universe";
import * as THREE from "three";
import SettingsRegion from "./ThreeCanvas/components/SettingsRegion";
import { View } from "react-native";
import HotkeysRegion from "./ThreeCanvas/components/HotkeysRegion";
import {
  orbitControl,
  cursor,
  actorControl,
} from "./ThreeCanvas/gestureControls";
import AddElementRegion from "./AddElementRegion";
import Actor from "./ThreeCanvas/classes/Actor";
import { TouchSummary } from "./ThreeCanvas/contexts/TouchTrackerContext";
import { screenDeltaToRealWorld } from "./ThreeCanvas/threeUtils";
import World from "./ThreeCanvas/classes/World";
import ReactPanel from "./ThreeCanvas/classes/ReactPanel";

export default function App() {
  const onUniverseCreate = useCallback((universe: Universe) => {
    console.log("universe onUniverseCreate", universe);

    // gesture control for cursor display
    universe.gestureControls.add(cursor);
    // gesture control for panning/rotating camera
    universe.gestureControls.add(orbitControl);
    // gesture control for connecting gestures to actors
    universe.gestureControls.add(actorControl);

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

    // draw group grid
    const gridHelper = new THREE.GridHelper(50, 50);
    universe.addObject("gridHelper", gridHelper);

    // draw box
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);
    cube.receiveShadow = true;
    const cubeActor = new Actor("cube01", cube);
    cubeActor.onHoverStart = function (event) {
      (this.object.material as THREE.MeshPhongMaterial).color.r = 0.5;
    };
    cubeActor.onHoverEnd = function (event) {
      (this.object.material as THREE.MeshPhongMaterial).color.r = 0;
    };
    cubeActor.onTouchDragStart = function (event) {
      // so we ensure only moving one element at a time
      event.stopPropagation();
    };
    cubeActor.onTouchDrag = function (event) {
      event.stopPropagation();
      // set drag speed based on camera's zoom and a constant speed
      const DRAG_SPEED = (event.world as World).camera.zoom * 0.02;
      // get delta of real world based on screen drag delta
      const delta = screenDeltaToRealWorld(
        (event.summary as TouchSummary).dragDeltaInterval,
        (event.world as World).camera.camera,
        DRAG_SPEED,
      );
      // update object's position
      this.object.position.x += delta.x;
      // this.object.position.y += delta.y;
      this.object.position.z += delta.z;
    };
    universe.addObject("cube01", cubeActor);

    // add panel settings
    const settingsPanel = new ReactPanel({
      _id: "settings",
      render: ({ world }) => {
        return (
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <SettingsRegion world={world} />
          </View>
        );
      },
    });
    universe.panels.addPanel(settingsPanel);

    // add panel hotkeys
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
    <View style={{ flex: 1, flexDirection: "row" }}>
      <AddElementRegion />
      <UniverseComponent onUniverseCreate={onUniverseCreate} />
    </View>
  );
}
