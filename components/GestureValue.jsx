import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";

const GestureValue = ({ action, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{value}</Text>
      {action === "volume" ? (
        <Feather name="volume-2" size={20} color={"rgba(250, 250, 250, 0.6)"} />
      ) : action === "Brightness" ? (
        <MaterialIcons
          name="brightness-6"
          size={20}
          color={"rgba(250, 250, 250, 0.6)"}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              textAlign:
                action === "volume"
                  ? "right"
                  : action === "Brightness"
                  ? "left"
                  : "center",
            },
          ]}
        >
          {action}
        </Text>
      )}
    </View>
  );
};

export default GestureValue;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: "50%",
    top: "50%",
    backgroundColor: "transparent",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    zIndex: 1,
  },
  text: {
    color: "rgba(250, 250, 250, 0.6)",
    fontSize: 20,
  },
});
