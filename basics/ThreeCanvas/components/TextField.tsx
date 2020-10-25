import React, { useRef } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface TextFieldProps {
  value: string;
  label: string;
  onChange: (val: string) => void;
}

export default ({ label, value, onChange }: TextFieldProps) => {
  const textInputRef = useRef<TextInput>(null);
  return (
    <TouchableWithoutFeedback onPress={() => textInputRef.current?.focus()}>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <Text style={{ paddingRight: 10 }}>{label}</Text>
        <TextInput
          ref={textInputRef}
          style={{
            flex: 1,
            width: "auto",
            minWidth: 0,
            textAlign: "right",
            ...Platform.select({
              ios: {},
              android: {},
              default: {
                outline: "none",
              },
            }),
          }}
          selectionColor={"transparent"}
          value={value}
          onChangeText={onChange}
          selectTextOnFocus={true}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
