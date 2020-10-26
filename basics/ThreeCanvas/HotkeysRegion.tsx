import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import World from "./classes/World";
import TextField from "./components/TextField";
import RegionHeader from "./components/RegionHeader";

/**
 * Display all world settings here
 */

interface SettingsRegionProps {
  world: World;
}

export default ({ world }: SettingsRegionProps) => {
  const [hotkeys, setHotkeys] = useState(world.keyMap.getHotkeys());
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        borderColor: "#e6e6e6",
        borderWidth: 1,
        backgroundColor: "#fff",
        width: 300,
        zIndex: 100,
      }}
    >
      <RegionHeader
        label={"Hotkeys"}
        isCollapsed={isCollapsed}
        onToggleCollapsed={setIsCollapsed}
      />
      {!isCollapsed && (
        <ScrollView style={{ maxHeight: 400 }}>
          {Object.values(world.keyMap.getHotkeyCommands()).map((command) => (
            <TextField
              key={command.key}
              label={command.name}
              value={hotkeys[command.key] || ""}
              onChange={(val) => {
                setHotkeys({ ...hotkeys, [command.key]: val });
                world.keyMap.setHotkeyByCommand(command.key, val);
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
