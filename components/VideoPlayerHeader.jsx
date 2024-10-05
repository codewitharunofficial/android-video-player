import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const VideoPlayerHeader = ({ video, setVisible, pauseAt, currentPosition, videoId }) => {
  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={() => {
          setVisible(false);
          pauseAt(videoId, currentPosition);
          console.log("Pressed");
        }}
        style={{
          width: "auto",
          height: "auto",
          padding: 10,
          borderRadius: 10,
          backgroundColor: "#000",
        }}
      >
        <AntDesign name="down" size={25} color={"white"} />
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={styles.text}>{video?.filename}</Text>
      </View>
    </View>
  );
};

export default VideoPlayerHeader;

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: "10%",
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 25,
    justifyContent: "center",
    position: "absolute",
    top: 0,
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
