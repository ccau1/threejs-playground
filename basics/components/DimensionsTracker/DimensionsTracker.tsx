import React from "react";
import { LayoutRectangle, View } from "react-native";

interface DimensionsTrackerProps {
  onResize?: (dimensions: LayoutRectangle) => void;
}

export default ({ onResize }: DimensionsTrackerProps) => {
  return (
    <View
      onLayout={(ev) => onResize?.(ev.nativeEvent.layout)}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
      pointerEvents="box-none"
    />
  );
};
