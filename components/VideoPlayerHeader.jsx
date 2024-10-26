import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";

const VideoPlayerHeader = ({ title, pauseAt, currentPosition, videoId, exitFullScreen }) => {
  const router = useRouter();
  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={() => {
          // setVisible(false);
         router.back();
          exitFullScreen();
          pauseAt(videoId, currentPosition);
          console.log(`Paused At: ${currentPosition}`);
        }}
        style={{
          width: "auto",
          height: "auto",
          paddingHorizontal: 10,
          borderRadius: 10,
          backgroundColor: "transparent",
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
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  );
};

export default VideoPlayerHeader;

const styles = StyleSheet.create({
  view: {
    width: "100%",
    height: "10%",
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 25,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    zIndex: 2
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});
