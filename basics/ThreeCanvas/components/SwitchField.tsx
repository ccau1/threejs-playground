import React from "react";
import { Switch, Text, TouchableOpacity } from "react-native";

interface TextFieldProps {
  value: boolean;
  label: string;
  onChange: (val: boolean) => void;
}

export default ({ label, value, onChange }: TextFieldProps) => {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
      }}
    >
      <Text style={{ paddingRight: 10 }}>{label}</Text>
      <Switch value={value} />
    </TouchableOpacity>
  );
};
