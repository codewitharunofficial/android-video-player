import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SubtitleComponent = ({ currentSubtitle }) => {
  return (
    <View style={styles.subtitleContainer}>
      <Text style={styles.subtitleText}>{currentSubtitle}</Text>
    </View>
  );
};

export default SubtitleComponent;

const styles = StyleSheet.create({
  subtitleContainer: {
    position: "absolute",
    bottom: "20%",
    left: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1
  },
  subtitleText: {
    color: "white",
    fontSize: 20,
    textAlign: 'center'
  },
});
