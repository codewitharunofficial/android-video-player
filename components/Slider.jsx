import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Slider from "@react-native-community/slider";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const SliderComponent = ({
  currentPosition,
  duration,
  isPlaying,
  setIsPlaying,
  pauseVideo,
  resumeVideo,
  slideToSet,
  showSubtitles,
  setShowSubtitles,
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
          onSlidingComplete={(value) => {
            slideToSet(value);
          }}
        />
        <Text style={styles.text}>
          {formatTime(duration - currentPosition)}
        </Text>
      </View>
      <View style={[styles.controls, { justifyContent: "space-between" }]}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.touchable}>
            <MaterialIcons name="music-note" size={20} color={"white"} />
          </TouchableOpacity>
          {showSubtitles ? (
            <TouchableOpacity
              onPress={() => {
                setShowSubtitles(false);
              }}
              style={styles.touchable}
            >
              <MaterialIcons name="subtitles-off" size={20} color={"white"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setShowSubtitles(true);
              }}
              style={styles.touchable}
            >
              <MaterialIcons name="subtitles" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          {isPlaying ? (
            <TouchableOpacity
              onPress={() => {
                setIsPlaying(false);
                pauseVideo();
                console.log("Paused");
              }}
              style={styles.touchable}
            >
              <Ionicons name="pause" size={20} color={"white"} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setIsPlaying(true);
                resumeVideo();
                console.log("Resumed");
              }}
              style={styles.touchable}
            >
              <Ionicons name="play" size={20} color={"white"} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.touchable}>
            <MaterialIcons
              name="screen-rotation-alt"
              size={20}
              color={"white"}
            />
          </TouchableOpacity>
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
    pointerEvents: 'box-none'
  },
  controls: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    zIndex: 10
  },
  touchable: {
    width: "auto",
    height: "auto",
    padding: 10,
    
  },
});
