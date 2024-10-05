import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const PlayerControls = ({
  isPlaying,
  setIsPlaying,
  pauseVideo,
  resumeVideo,
}) => {
  return (
    <>
      {isPlaying ? (
        <Ionicons
          onPress={() => {
            pauseVideo();
            setIsPlaying(false);
          }}
          name="pause"
          size={30}
          color={"white"}
          style={{ position: "absolute", bottom: "50%", left: "50%" }}
        />
      ) : (
        <Ionicons
          onPress={() => {
            resumeVideo();
            setIsPlaying(true);
          }}
          name="play"
          size={30}
          color={"white"}
          style={{ position: "absolute", bottom: "50%", left: "50%" }}
        />
      )}
    </>
  );
};

export default PlayerControls;

const styles = StyleSheet.create({});
