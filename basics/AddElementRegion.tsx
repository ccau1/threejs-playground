import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{ zIndex: 1 }}>
      {isOpen && (
        <View
          style={{ width: 300, height: 300, backgroundColor: "#fff" }}
        ></View>
      )}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 0,
          right: -30,
          width: 30,
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: "#fff",
          borderTopRightRadius: 10,
          borderBottomRightRadius: 10,
        }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text>{isOpen ? "<" : ">"}</Text>
      </TouchableOpacity>
    </View>
  );
};
