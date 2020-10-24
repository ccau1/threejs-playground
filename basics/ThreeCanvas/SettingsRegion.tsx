import React, { useState } from "react";
import { View } from "react-native";
import World from "./classes/World";
import PickerField from "./components/PickerField";
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
  const [cameraType, setCameraType] = useState(
    world?.getCamera().getType().toString(),
  );
  const is3d = cameraType === "PerspectiveCamera";
  const cameraTypeOptions = [
    { value: "OrthographicCamera", text: "Orthographic Camera" },
    { value: "PerspectiveCamera", text: "Perspective Camera" },
  ];

  // Zoom settings
  const [zoom, setZoom] = useState(
    world?.getCamera().getZoom().toString() || "",
  );

  // Camera Speed settings
  const [cameraSpeed, setCameraSpeed] = useState(
    world?.getCamera().getSpeed().toString() || "",
  );

  // Camera First Person View settings
  const [isFirstPersonView, setIsFirstPersonView] = useState(
    world?.getCamera().getIsFirstPersonView(),
  );

  // Camera First Person View Height settings
  const [firstPersonViewHeight, setFirstPersonViewHeight] = useState(
    world?.getCamera().getFirstPersonViewHeight().toString(),
  );

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
      }}
    >
      <SwitchField
        label={"3D"}
        value={is3d}
        onChange={(is3d) => {
          const newCameraType = !is3d
            ? "OrthographicCamera"
            : "PerspectiveCamera";
          world?.getCamera().setType(newCameraType);
          setCameraType(newCameraType);
        }}
      />
      <PickerField
        label={"Camera"}
        value={cameraType}
        options={cameraTypeOptions}
        onChange={(val) => {
          setCameraType(val);

          world?.getCamera().setType(val as CameraType);
        }}
      />
      <SwitchField
        label={"FPV (First Person View)"}
        value={isFirstPersonView}
        onChange={(isFirstPersonView) => {
          world?.getCamera().setIsFirstPersonView(isFirstPersonView);
          setIsFirstPersonView(isFirstPersonView);
        }}
      />
      <TextField
        label={"FPV Height"}
        value={firstPersonViewHeight}
        onChange={(val) => {
          const firstPersonViewHeightNum = parseFloat(val);
          if (val !== "" && isNaN(firstPersonViewHeightNum)) return;
          setFirstPersonViewHeight(val);

          if (!isNaN(firstPersonViewHeightNum)) {
            world
              ?.getCamera()
              .setFirstPersonViewHeight(firstPersonViewHeightNum);
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
            world?.getCamera().setZoom(zoomNum);
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
            world?.getCamera().setSpeed(speedNum);
          }
        }}
      />
    </View>
  );
};
