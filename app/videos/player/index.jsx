import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Video } from "expo-av";
// import Video from "react-native-video";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  PanGestureHandler,
  State,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Slider from "@/components/Slider";
import VideoPlayerHeader from "@/components/VideoPlayerHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Brightness from "expo-brightness";
import { NativeModules } from "react-native";
import * as FileSystem from "expo-file-system";
import SubtitlesParser from "subtitles-parser";
import SubtitleComponent from "@/components/SubtitleComponent";
import GestureValue from "@/components/GestureValue";
import { useLocalSearchParams } from "expo-router";
const VideoPlayerScreen = ({ visible, setVisible }) => {
  const { uri, videoId, title } = useLocalSearchParams();

  // console.log(video);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [forwarding, setForwarding] = useState(false);
  const [backwarding, setBackwarding] = useState(false);
  const [seekOffSet, setSeekOffSet] = useState(0);
  const [rotated, setRotated] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [brightnessUp, setBrightnessUp] = useState(false);
  const [brightnessDown, setBrightnessDown] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [volumeUp, setVolumeUp] = useState(false);
  const [volumeDown, setVolumeDown] = useState(false);
  const [subtitles, setSubtitles] = useState();
  const [videoStatus, setVideoStatus] = useState({});
  const [currentSubtitles, setCurrentSubtitles] = useState("");
  const [showSubtitles, setShowSubtitles] = useState(false);

  const initialBrightness = useRef(0);
  const initialVolume = useRef(0);
  const controls = useRef(null);
  // const doubleTap = useRef(null);
  const tapRef = useRef(null);
  const panRef = useRef(null);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  const { FullScreenModule } = NativeModules;
  const { Subtitles } = NativeModules;
  const outputPath = `${FileSystem.documentDirectory}_${Date.now()}.srt`;

  //Extracting Subtitles

  const getSubtitles = async () => {
    const subtitles = await Subtitles.extract(uri, outputPath);
    if (subtitles) {
      // console.log(subtitles);
      loadSubtitles(outputPath);
    }
  };

  //Loading Subtitles

  const loadSubtitles = async (filePath) => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(filePath);
      const parsedSubtitles = SubtitlesParser.fromSrt(fileContent);
      setSubtitles(parsedSubtitles);
    } catch (error) {
      console.error(error);
    }
  };

  //Time Formatting
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

  //get and load subtitles if available
  useEffect(() => {
    getSubtitles();
  }, []);

  //sync and show subtitles
  useEffect(() => {
    if (videoStatus.isLoaded && videoStatus.positionMillis) {
      if (subtitles) {
        const currentTime = formatTime(currentPosition);
        const subtitle = subtitles?.find(
          (s) => currentTime >= s.startTime && currentTime <= s.endTime
        );
        setCurrentSubtitles(subtitle ? subtitle.text : " ");
      }
    }
  }, [videoStatus.positionMillis, subtitles]);

  async function unloackOrientation() {
    await ScreenOrientation.unlockAsync();
  }

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
    fullScreen();
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

  const onGestureEvent = (event) => {

    try {
      const { translationX } = event?.nativeEvent;
      const { translationY, x } = event?.nativeEvent;

      switch (true) {
        case translationX > 50:
          let seekTime = currentPosition + translationX * 1000;
          if (seekTime >= 0 && seekTime <= duration) {
            videoRef.current.setPositionAsync(seekTime);
            setForwarding(true);
            setSeekOffSet(Math.floor(translationX));
          }
          break;
        case translationX < -50:
          seekTime = currentPosition + translationX * 1000;
          videoRef.current.setPositionAsync(seekTime);
          setBackwarding(true);
          setSeekOffSet(Math.floor(translationX));
          break;
        case x < width / 2 && translationY > 50:
          setBrightnessUp(true);
          const newBrightness = Math.max(
            0,
            Math.min(initialBrightness.current - translationY / 500, 1)
          );
          Brightness.setBrightnessAsync(newBrightness);
          setBrightness(newBrightness);
          break;

        case x < width / 2 && translationY < -50:
          setBrightnessDown(true);
          const brightness = Math.max(
            1,
            Math.min(initialBrightness.current - translationY / 500, 0)
          );
          Brightness.setBrightnessAsync(brightness);
          setBrightness(brightness);
          console.log(brightness);
          break;

        case x > width / 2 && translationY > 50:
          setVolumeUp(true);
          let newVolume = Math.max(
            0,
            Math.min(initialVolume.current + translationY / 1000, 1)
          );
          videoRef.current.setVolumeAsync(newVolume);
          setVolume(newVolume);
          console.log(newVolume);
          break;

        case x > width / 2 && translationY < -50:
          setVolumeDown(true);
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
    await videoRef.current.pauseAsync();
    pauseVideoAt(videoId, currentPosition);
  };

  const resume = async () => {
    await videoRef.current.playFromPositionAsync(currentPosition);
  };

  const onHandlerStateChange = (event) => {
    if (event?.nativeEvent?.state === State.END) {
      setSeekOffSet(0);
      switch (true) {
        case forwarding:
          setForwarding(false);
          break;
        case backwarding:
          setBackwarding(false);
          break;
        case volumeUp:
          setVolumeUp(false);
          break;
        case volumeDown:
          setVolumeDown(false);
          break;
        case brightnessUp:
          setBrightnessUp(false);
          break;
        case brightnessDown:
          setBrightnessDown(false);
          break;
      }
    }
  };

  const pauseVideoAt = async (videoId, currentPosition) => {
    AsyncStorage.setItem(`${videoId}`, `${currentPosition}`);
    console.log("Video Position Saved");
  };

  const resumeVideo = async () => {
    const data = await AsyncStorage.getItem(`${videoId}`);
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
    await videoRef.current?.setPositionAsync(position);
    console.log("Forwarding...");
  };

  useEffect(() => {
    resumeVideo();
  }, []);

  const hideControls = () => {
    controls.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);
  };

  const handleTap = (event) => {
    // console.log("Tapped");
    if (controls.current) {
      clearTimeout(controls.current);
    }
    setShowControls((prev) => !prev);
    if (!showControls) {
      hideControls();
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        //   marginTop: "20%",
        paddingTop: rotated ? 0 : "5%",
        backgroundColor: "#000",
      }}
    >
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={(event) => onGestureEvent(event)}
        onHandlerStateChange={onHandlerStateChange}
        hitSlop={{ left: 0, right: 0, top: 0, bottom: 0 }}
        waitFor={tapRef}
      >
        <TapGestureHandler
          ref={tapRef}
          onHandlerStateChange={handleTap}
          numberOfTaps={1}
          // waitFor={panRef}
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
            {showSubtitles && (
              <SubtitleComponent
                currentSubtitle={currentSubtitles ? currentSubtitles : null}
              />
            )}
            {forwarding ? (
              <GestureValue
                action={forwarding ? ">>" : ""}
                value={seekOffSet}
              />
            ) : backwarding ? (
              <GestureValue
                action={backwarding ? "<<" : ""}
                value={seekOffSet}
              />
            ) : volumeUp ? (
              <GestureValue
                action={volumeUp ? "volume" : ""}
                value={Math.floor(volume * 10)}
              />
            ) : volumeDown ? (
              <GestureValue
                action={volumeDown ? "volume" : ""}
                value={Math.floor(volume * 10)}
              />
            ) : brightnessUp ? (
              <GestureValue
                action={brightnessUp ? "Brightness" : ""}
                value={Math.floor(brightness * 10)}
              />
            ) : brightnessDown ? (
              <GestureValue
                action={brightnessDown ? "Brightness" : ""}
                value={Math.floor(brightness * 10)}
              />
            ) : null}

            {showControls && (
              <>
                <VideoPlayerHeader
                  video={uri}
                  setVisible={setVisible}
                  pauseAt={pauseVideoAt}
                  currentPosition={currentPosition}
                  videoId={videoId}
                  exitFullScreen={exitFullScreen}
                />
              </>
            )}

            <Video
              ref={videoRef}
              source={{ uri: uri }}
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
          </View>
        </TapGestureHandler>
      </PanGestureHandler>
      {/* <TouchableOpacity
            ref={tapRef}
            onPress={() => handleTap()}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: "10%",
              left: 0,
              bottom: "10%",
              backgroundColor: "transparent",
              zIndex: 1,
              alignSelf: "center",
            }}
          /> */}
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
            subtitles={subtitles}
            slideToSet={slideToSetPosition}
            showSubtitles={showSubtitles}
            setShowSubtitles={setShowSubtitles}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({});
