import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import World from "./classes/World";
import PickerField from "./components/PickerField";
import RegionHeader from "./components/RegionHeader";
import SwitchField from "./components/SwitchField";
import TextField from "./components/TextField";

/**
 * Display all world settings here
 */

interface SettingsRegionProps {
  world: World;
}

export default ({ world }: SettingsRegionProps) => {
  // Camera Type settings
  const [cameraType, setCameraType] = useState(world?.camera.type.toString());
  const is3d = cameraType === "PerspectiveCamera";
  const cameraTypeOptions = [
    { value: "OrthographicCamera", text: "Orthographic Camera" },
    { value: "PerspectiveCamera", text: "Perspective Camera" },
  ];

  // Zoom settings
  const [zoom, setZoom] = useState(world?.camera.zoom.toString() || "");

  // Camera Speed settings
  const [cameraSpeed, setCameraSpeed] = useState(
    world?.camera.speed.toString() || "",
  );

  // Camera First Person View settings
  const [isFirstPersonView, setIsFirstPersonView] = useState(
    world?.camera.isFirstPersonView,
  );

  // Camera First Person View Height settings
  const [firstPersonViewHeight, setFirstPersonViewHeight] = useState(
    world?.camera.firstPersonViewHeight.toString(),
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        borderColor: "#e6e6e6",
        borderWidth: 1,
        backgroundColor: "#fff",
        width: 300,
        paddingTop: StatusBar.currentHeight,
        zIndex: 100,
      }}
    >
      <RegionHeader
        label={"Global Settings"}
        isCollapsed={isCollapsed}
        onToggleCollapsed={setIsCollapsed}
      />
      {!isCollapsed && (
        <View>
          <SwitchField
            label={"3D"}
            value={is3d}
            onChange={(is3d) => {
              const newCameraType = !is3d
                ? "OrthographicCamera"
                : "PerspectiveCamera";
              world.camera.type = newCameraType;
              setCameraType(newCameraType);
            }}
          />
          <PickerField
            label={"Camera"}
            value={cameraType}
            options={cameraTypeOptions}
            onChange={(val) => {
              setCameraType(val);

              world.camera.type = val as CameraType;
            }}
          />
          <SwitchField
            label={"FPV (First Person View)"}
            value={isFirstPersonView}
            onChange={(isFirstPersonView) => {
              world.camera.isFirstPersonView = isFirstPersonView;
              setIsFirstPersonView(isFirstPersonView);
            }}
            disabled={world?.camera.type === "OrthographicCamera"}
          />
          <TextField
            label={"FPV Height"}
            value={firstPersonViewHeight}
            onChange={(val) => {
              const firstPersonViewHeightNum = parseFloat(val);
              if (val !== "" && isNaN(firstPersonViewHeightNum)) return;
              setFirstPersonViewHeight(val);

              if (!isNaN(firstPersonViewHeightNum)) {
                world.camera.firstPersonViewHeight = firstPersonViewHeightNum;
              }
            }}
          />
          <TextField
            label={"Zoom"}
            value={zoom}
            onChange={(val) => {
              const zoomNum = parseFloat(val);
              if (val !== "" && isNaN(zoomNum)) return;
              setZoom(val);

              if (!isNaN(zoomNum)) {
                world.camera.zoom = zoomNum;
              }
            }}
          />
          <TextField
            label={"Cam Speed"}
            value={cameraSpeed}
            onChange={(val) => {
              const speedNum = parseFloat(val);
              if (val !== "" && isNaN(speedNum)) return;
              setCameraSpeed(val);

              if (!isNaN(speedNum)) {
                world.camera.speed = speedNum;
              }
            }}
          />
        </View>
      )}
    </View>
  );
};
