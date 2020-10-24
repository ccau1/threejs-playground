import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { Picker } from "@react-native-community/picker";

interface PickerFieldProps {
  value: string;
  label: string;
  onChange: (val: string) => void;
  options: Array<{ text: string; value: string }>;
}

export default ({ label, value, onChange, options }: PickerFieldProps) => {
  return (
    <TouchableWithoutFeedback onPress={() => null}>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <Text style={{ paddingRight: 10 }}>{label}</Text>
        <Picker
          style={{ flex: 1 }}
          selectedValue={value}
          onValueChange={(val) => onChange(val.toString())}
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              value={option.value}
              label={option.text}
            />
          ))}
        </Picker>
      </View>
    </TouchableWithoutFeedback>
  );
};
