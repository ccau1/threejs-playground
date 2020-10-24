import React from "react";
import { Switch, Text, TouchableOpacity } from "react-native";

interface TextFieldProps {
  value: boolean;
  label: string;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export default ({ label, value, onChange, disabled }: TextFieldProps) => {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onChange(!value)}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
      }}
    >
      <Text style={{ paddingRight: 10 }}>{label}</Text>
      <Switch value={value} disabled={disabled} />
    </TouchableOpacity>
  );
};
