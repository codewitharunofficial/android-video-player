import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import { Video } from "expo-av";
import Video from "react-native-video";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import Slider from "@/components/Slider";
import VideoPlayerHeader from "@/components/VideoPlayerHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Brightness from "expo-brightness";
import { NativeModules } from "react-native";
import SubtitleComponent from "@/components/SubtitleComponent";
import GestureValue from "@/components/GestureValue";
import { useLocalSearchParams } from "expo-router";
import AudioTracksComponent from "@/components/AudioTracksComponent";
const VideoPlayerScreen = ({ visible, setVisible }) => {
  const { uri, videoId, title } = useLocalSearchParams();

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [enableSubtitles, setEnableSubtitles] = useState(false);
  const [currentSubtitles, setCurrentSubtitles] = useState(0);
  const [showAudioTracks, setShowAudioTracks] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState(0);
  const [audioTracks, setAudioTracks] = useState();
  const initialBrightness = useRef(0);
  const initialVolume = useRef(0);
  const controls = useRef(null);
  // const doubleTap = useRef(null);
  const tapRef = useRef(null);
  const panRef = useRef(null);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  const { FullScreenModule } = NativeModules;
  

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

      // console.log(event?.nativeEvent);

      switch (true) {
        case translationX > 50:
          let seekTime = currentPosition + translationX / 10;
          // console.log(seekTime, currentPosition);
          if (seekTime >= 0 && seekTime <= duration) {
            videoRef.current.seek(seekTime);
            setForwarding(true);
            setSeekOffSet(Math.floor(translationX / 10));
          }
          break;
        case translationX < -50:
          seekTime = currentPosition + translationX / 10;
          videoRef.current.seek(seekTime);
          setBackwarding(true);
          setSeekOffSet(Math.floor(translationX / 10));
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
          // videoRef.current.setVolumeAsync(newVolume);
          setVolume(newVolume);
          console.log(newVolume);
          break;

        case x > width / 2 && translationY < -50:
          setVolumeDown(true);
          newVolume = Math.max(
            1,
            Math.min(initialVolume.current + translationY / 1000, 0)
          );
          // videoRef.current.setVolumeAsync(newVolume);
          setVolume(newVolume);
          console.log(newVolume);
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pauseVideo = async () => {
    // await videoRef.current.pauseAsync();
    setIsPaused(true);
    pauseVideoAt(videoId, currentPosition);
  };

  const resume = async () => {
    // await videoRef.current.playFromPositionAsync(currentPosition);
    setIsPaused(false);
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
    console.log("Resuming..>!");
    const data = await AsyncStorage.getItem(`${videoId}`);
    const res = parseFloat(data);
    console.log(res);
    if (res) {
      if (res === duration || !res) {
        videoRef.current?.seek(0);
      } else {
        setCurrentPosition(res);
        await videoRef.current.seek(res);
      }
    } else {
      console.log("Video Was Finished or It wasn't even started");
    }
  };

  const slideToSetPosition = async (position) => {
    await videoRef.current?.seek(position);
    console.log("Forwarding...");
  };

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
    if (showControls) {
      exitFullScreen();
    }
    if (!showControls) {
      hideControls();
      fullScreen();
    }
  };

  const changeToLandScape = async () => {
    ScreenOrientation.unlockAsync();
  }

  // console.log(currentSubtitles)

  // const {height, width} = Dimensions.get('window');

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
        // waitFor={tapRef}
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
          <SubtitleComponent
            visible={showSubtitles}
            subtitles={subtitles}
            setVisible={setShowSubtitles}
            height={height}
            width={width}
            setCurrentSubtitles={setCurrentSubtitles}
            setEnableSubtitles={setEnableSubtitles}
          />
          <AudioTracksComponent
            visible={showAudioTracks}
            setVisible={setShowAudioTracks}
            height={height}
            width={width}
            setCurrentAudioTracks={setCurrentAudioTrack}
            audioTracks={audioTracks}
           />
          {forwarding ? (
            <GestureValue action={forwarding ? "+s >>" : ""} value={seekOffSet} />
          ) : backwarding ? (
            <GestureValue action={backwarding ? "<< -s" : ""} value={seekOffSet} />
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
                title={title}
                setVisible={setVisible}
                pauseAt={pauseVideoAt}
                currentPosition={currentPosition}
                videoId={videoId}
                exitFullScreen={exitFullScreen}
              />
            </>
          )}

          <Video
            // showNotificationControls={true}
            preventsDisplaySleepDuringVideoPlayback={true}
            ref={videoRef}
            source={{
              uri: uri,
            }}
            resizeMode="contain"
            style={{
              width: width,
              height: height,
            }}
            progressUpdateInterval={1000}
            onAudioBecomingNoisy={pauseVideo}
            onProgress={(progress) => {
              setDuration(progress.seekableDuration);
              setCurrentPosition(progress.currentTime);
            }}
            onPlaybackStateChanged={(state) => {
              // setVideoStatus(state);
              setIsPlaying(state.isPlaying);
            }}
            onTouchEndCapture={() => handleTap()}
            paused={isPaused}
            volume={volume}
            onLoad={() => resumeVideo()}
            selectedAudioTrack={{type: 'index', value: currentAudioTrack ? currentAudioTrack : 0}}
            selectedTextTrack={enableSubtitles ? {type: 'index', value: currentSubtitles} : null}
            onTextTracks={(tracks) => setSubtitles(tracks.textTracks)}
            onAudioTracks={(tracks) => setAudioTracks(tracks.audioTracks)}
          />
        </View>
      </PanGestureHandler>
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
            rotateToLandScape={changeToLandScape}
            showAudioTracks={showAudioTracks}
            setShowAudioTracks={setShowAudioTracks}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({});
