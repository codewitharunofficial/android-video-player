import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

const SliderComponent = ({
  currentPosition,
  duration,
  isPlaying,
  setIsPlaying,
  pauseVideo,
  pauseVideoAt,
  resumeVideo
}) => {
  const formatTime = (duration) => {
    const totalSeconds = Math.floor(duration / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  return (
    <View style={styles.view}>
      <View style={styles.controls}>
        <Text style={styles.text}>{formatTime(currentPosition)}</Text>
        <Slider
          value={currentPosition}
          minimumValue={0}
          maximumValue={duration}
          maximumTrackTintColor="white"
          minimumTrackTintColor="orange"
          style={styles.slider}
        />
        <Text style={styles.text}>
          {formatTime(duration - currentPosition)}
        </Text>
      </View>
      <View style={[styles.controls, { justifyContent: "space-between" }]}>
        <View
          style={[
            styles.controls,
            {
              gap: 30,
              alignSelf: "flex-end",
              justifyContent: "center",
              paddingHorizontal: 20,
              width: "50%",
            },
          ]}
        >
          <MaterialIcons name="music-note" size={20} color={"white"} />
          <MaterialIcons name="subtitles" size={20} color={"white"} />
          <MaterialCommunityIcons
            name="crop-rotate"
            size={20}
            color={"white"}
          />
        </View>
        <View
          style={[
            styles.controls,
            {
              alignSelf: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              width: "50%",
            },
          ]}
        >
          <MaterialIcons name="skip-previous" size={20} color={"white"} />
          {isPlaying ? (
            <Ionicons name="pause" size={20} color={"white"} />
          ) : (
            <Ionicons name="play" size={20} color={"white"} />
          )}
          <MaterialIcons name="skip-next" size={20} color={"white"} />
        </View>
      </View>
    </View>
  );
};

export default SliderComponent;

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 16,
  },
  slider: {
    flex: 1,
  },
  view: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: "8%",
    flexDirection: "column",
    paddingHorizontal: 20,
    gap: 10,
  },
  controls: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
});
