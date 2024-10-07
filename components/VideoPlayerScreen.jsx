import {
  BackHandler,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BottomModal } from "react-native-modals";
// import Video  from "react-native-video";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Slider from "./Slider";
import PlayerControls from "./PlayerControls";
import VideoPlayerHeader from "./VideoPlayerHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopControls from "./TopControls";
import * as Brightness from "expo-brightness";
import { NativeModules } from "react-native";
import * as FileSystem from "expo-file-system";
import fs from "expo-file-system";
import SubtitlesParser from "subtitles-parser";
const VideoPlayerScreen = ({ visible, setVisible, video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [seekOffSet, setSeekOffSet] = useState(0);
  const [rotated, setRotated] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [subtitles, setSubtitles] = useState();
  const [videoStatus, setVideoStatus] = useState({});
  const [currentSubtitles, setCurrentSubtitles] = useState("");

  const initialBrightness = useRef(0);
  const initialVolume = useRef(0.5);
  const controller = useRef(null);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  const { Subtitles } = NativeModules;
  const outputPath = `${FileSystem.documentDirectory}_${Date.now()}.srt`;

  const getSubtitles = async () => {
    try {
      const subtitles = await Subtitles.extract(video?.uri, outputPath);
      if (subtitles) {
        // console.log(subtitles);
        loadSubtitles(outputPath);
      } else {
        console.log("No Subtitles Available");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadSubtitles = async (filePath) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const parsedSubtitles = SubtitlesParser.fromSrt(fileContent);
      setSubtitles(parsedSubtitles);
      // console.log(parsedSubtitles);
    } catch (error) {
      console.error(error);
    }
  };

  //get and load subtitles if available
  useEffect(() => {
    getSubtitles();
  }, []);

  //sync and show subtitles
  useEffect(() => {
    if (videoStatus.isLoaded && videoStatus.positionMillis) {
      const currentTime = videoStatus.positionMillis / 1000;
      const subtitle = subtitles.find(
        (s) => currentTime >= s.startTime && currentTime <= s.endTime
      );
      setCurrentSubtitles(subtitle ? subtitle.text : " ");
    }
  }, [videoStatus.positionMillis, subtitles]);

  async function unloackOrientation() {
    await ScreenOrientation.unlockAsync();
  }

  const { FullScreenModule } = NativeModules;

  const fullScreen = async () => {
    try {
      await FullScreenModule.enableFullscreen();
      // console.log(fullscreen);
    } catch (error) {
      console.error(error);
    }
  };

  const exitFullScreen = async () => {
    await FullScreenModule.disableFullscreen();
  };

  useEffect(() => {
    if (visible) {
      fullScreen();
    }
  }, []);

  useEffect(() => {
    unloackOrientation();
    setRotated(true);
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  const hideControls = () => {
    controller.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const onGestureEvent = (event) => {
    // console.log(event?.type);

    if (controller.current) {
      clearTimeout(controller.current);
    }

    setShowControls((prev) => !prev);
    if (!showControls) {
      hideControls();
    }

    try {
      const { translationX } = event?.nativeEvent;
      const { translationY, x } = event?.nativeEvent;
      // console.log(translationY);

      switch (true) {
        case translationX > 50:
          let seekTime = currentPosition + translationX * 100;
          if (seekTime >= 0 && seekTime <= duration) {
            videoRef.current.setPositionAsync(seekTime);
            setSeekOffSet(translationX);
          }
          break;
        case translationX < -50:
          seekTime = currentPosition + translationX * 100;
          videoRef.current.setPositionAsync(seekTime);
          setSeekOffSet(translationX);
          console.log(translationX);
          break;
        case x < width / 2 && translationY > 50:
          const newBrightness = Math.max(
            0,
            Math.min(initialBrightness.current - translationY / 500, 1)
          );
          Brightness.setBrightnessAsync(newBrightness);
          setBrightness(newBrightness);
          break;

        case x < width / 2 && translationY < -50:
          const brightness = Math.max(
            1,
            Math.min(initialBrightness.current - translationY / 500, 0)
          );
          Brightness.setBrightnessAsync(brightness);
          setBrightness(brightness);
          console.log(brightness);
          break;

        case x > width / 2 && translationY > 50:
          let newVolume = Math.max(
            0,
            Math.min(initialVolume.current + translationY / 1000, 1)
          );
          videoRef.current.setVolumeAsync(newVolume);
          setVolume(newVolume);
          console.log(newVolume);
          break;

        case x > width / 2 && translationY < -50:
          newVolume = Math.max(
            1,
            Math.min(initialVolume.current + translationY / 1000, 0)
          );
          videoRef.current.setVolumeAsync(newVolume);
          setVolume(newVolume);
          console.log(newVolume);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pauseVideo = async () => {
    videoRef.current.pauseAsync();
  };

  const resume = async () => {
    videoRef.current.playFromPositionAsync(currentPosition);
  };

  const onHandlerStateChange = (event) => {
    if (event?.nativeEvent?.state === State.END) {
      setSeekOffSet(0);
    }
  };

  const pauseVideoAt = async (videoId, currentPosition) => {
    AsyncStorage.setItem(`${videoId}`, `${currentPosition}`);
    console.log("Video Position Saved");
  };

  const resumeVideo = async () => {
    const data = await AsyncStorage.getItem(`${video?.id}`);
    const res = JSON.parse(data);
    if (res) {
      if (res === duration || !res) {
        videoRef.current?.playFromPositionAsync(0);
      } else {
        setCurrentPosition(res);
        videoRef.current?.playFromPositionAsync(res);
      }
    } else {
      console.log("Video Was Finished or It wasn't even started");
    }
  };

  const slideToSetPosition = async (position) => {
    videoRef.current?.setPositionAsync(position);
    console.log("Forwarding...");
  };

  useEffect(() => {
    resumeVideo();
  }, [visible]);

  return (
    <SafeAreaView style={{ flex: 1, marginTop: "20%" }}>
      <BottomModal
        swipeDirection={["up"]}
        onSwiping={() => {
          setVisible(false);
          setIsPlaying(false);
          pauseVideoAt();
        }}
        visible={visible}
        style={{
          flex: 1,
          paddingTop: rotated ? 0 : "5%",
          backgroundColor: "#000",
        }}
      >
        <PanGestureHandler
          onGestureEvent={(event) => onGestureEvent(event)}
          onHandlerStateChange={onHandlerStateChange}
          hitSlop={{ left: 0, right: 0, top: 0, bottom: 30 }}
          minDist={10}
          minVelocity={0.3}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showControls && (
              <>
                <VideoPlayerHeader
                  video={video}
                  setVisible={setVisible}
                  pauseAt={pauseVideoAt}
                  currentPosition={currentPosition}
                  videoId={video.id}
                  exitFullScreen={exitFullScreen}
                />
              </>
            )}

            <Video
              ref={videoRef}
              source={{ uri: video?.uri }}
              resizeMode="contain"
              style={{
                width: "100%",
                height: rotated && showControls ? "80%" : "100%",
              }}
              shouldPlay={true}
              onPlaybackStatusUpdate={(status) => {
                setDuration(status.durationMillis);
                setIsPlaying(status.isPlaying);
                setCurrentPosition(status.positionMillis);
                setVideoStatus(status);
              }}
            />
            {showControls && (
              <>
                <Slider
                  currentPosition={currentPosition}
                  duration={duration}
                  pauseVideo={pauseVideo}
                  pauseVideoAt={pauseVideoAt}
                  resumeVideo={resume}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  showControls={showControls}
                  slideToSet={slideToSetPosition}
                />
              </>
            )}
            <TouchableOpacity
              onPress={() => setShowControls(true)}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "transparent",
                zIndex: 1,
              }}
            />
          </View>
        </PanGestureHandler>
      </BottomModal>
    </SafeAreaView>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({});
