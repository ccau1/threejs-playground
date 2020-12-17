import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import World from "../classes/World";
import TextField from "./TextField";
import RegionHeader from "./RegionHeader";

/**
 * Display all world settings here
 */

interface SettingsRegionProps {
  world: World;
}

export default ({ world }: SettingsRegionProps) => {
  const [hotkeys, setHotkeys] = useState(world.keyMap.hotkeys);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View
      style={{
        borderColor: "#e6e6e6",
        borderWidth: 1,
        backgroundColor: "#fff",
        width: 300,
        zIndex: 100,
      }}
    >
      {!isCollapsed && (
        <ScrollView style={{ maxHeight: 400 }}>
          {Object.values(world.keyMap.hotkeyCommands).map((command) => (
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
      <RegionHeader
        label={"Hotkeys"}
        isCollapsed={isCollapsed}
        onToggleCollapsed={setIsCollapsed}
      />
    </View>
  );
};
