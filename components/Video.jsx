import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
// import { Video } from "expo-av";
import { TouchableOpacity } from "react-native";
import VideoPlayerScreen from "./VideoPlayerScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeModules } from "react-native";
import * as FileSystem from "expo-file-system";
import { Feather } from "@expo/vector-icons";

const VideoComponents = ({ video }) => {
  const [playVideo, setPlayVideo] = useState(false);
  const [ifPending, setIfPending] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [position, setPosition] = useState(0);

  useEffect(() => {
    checkVideosIfPlayed(video.id);
  }, []);

  // useEffect(() => {
  //   getSubtitles();
  // }, []);

  const checkVideosIfPlayed = async (videoId) => {
    const res = await AsyncStorage.getItem(`${videoId}`);
    if (res) {
      setIfPending(true);
      const data = JSON.parse(res);
      if (data < video.duration * 60) {
        const pos = Math.floor((data / (video.duration * 60)) * 100);
        setPosition(pos);
      } else if (data === video.duration * 60) {
        setIsFinished(true);
      }
    } else {
      setIfPending(false);
    }
  };

  const { width, height } = Dimensions.get("window");
  const itemWidth = width / 2;
  const itemHeight = height / 3.5;
  // console.log(video);
  return (
    <>
      {playVideo && (
        <VideoPlayerScreen
          visible={playVideo}
          setVisible={setPlayVideo}
          video={video}
        />
      )}
      <TouchableOpacity
        onPress={() => setPlayVideo(true)}
        style={{ width: itemWidth - 10, height: itemHeight - 10, padding: 10 }}
      >
        <View
          style={{
            height: "1%",
            width: ifPending ? `${position}%` : 0,
            position: "absolute",
            bottom: "35%",
            backgroundColor: "orange",
            zIndex: 1,
            left: 15,
          }}
        />
        {isFinished && (
          <Feather
            name="check-circle"
            size={16}
            color={"gray"}
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 1,
              padding: 5,
              borderRadius: 5,
            }}
          />
        )}
        <Image
          source={{ uri: video?.thumbnail ? video.thumbnail : null }}
          resizeMode="cover"
          style={{ width: "100%", height: "70%", borderRadius: 10 }}
        />
        <Text>{video?.filename}</Text>
      </TouchableOpacity>
    </>
  );
};

export default VideoComponents;

const styles = StyleSheet.create({});
