/* eslint-disable react-native/no-inline-styles */

import { ActivityIndicator, Modal, View, Text } from "react-native";
import React from "react";
import { ColorPicker } from "react-native-color-picker";
export type Props = {
  visible: boolean;
  selectedColor(color: string): Function;
};

export const ColorPickerModal: React.FC<Props> = ({ visible = false, selectedColor }) => {
  return (
    <Modal
      animationType={"fade"}
      visible={visible}
      transparent={true}
      style={{ justifyContent: "center", alignItems: "center" }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",

          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={{ width: "80%", height: "40%", backgroundColor: "black", borderRadius: 10 }}>
          <ColorPicker onColorSelected={selectedColor} style={{ flex: 1, padding: 20 }} />
        </View>
      </View>
    </Modal>
  );
};
