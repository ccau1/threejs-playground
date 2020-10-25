import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RegionHeaderProps {
  label?: string;
  isCollapsed?: boolean;
  onToggleCollapsed?: (newIsCollapsed: boolean) => void;
}

export default ({
  label,
  isCollapsed,
  onToggleCollapsed,
}: RegionHeaderProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: "space-between",
        borderBottomColor: "#e6e6e6",
        borderBottomWidth: 1,
      }}
    >
      <Text>{label}</Text>
      <TouchableOpacity onPress={() => onToggleCollapsed?.(!isCollapsed)}>
        <Text>{isCollapsed ? "[open]" : "[x]"}</Text>
      </TouchableOpacity>
    </View>
  );
};
