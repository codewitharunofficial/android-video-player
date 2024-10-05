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
import { BottomModal, ModalContent } from "react-native-modals";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Slider from "./Slider";
import PlayerControls from "./PlayerControls";
import VideoPlayerHeader from "./VideoPlayerHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopControls from "./TopControls";
import * as Brightness from 'expo-brightness';

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

  const initialBrightness = useRef(0);
  const initialVolume = useRef(0.5);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  async function unloackOrientation() {
    await ScreenOrientation.unlockAsync();
  }

  useEffect(() => {
    unloackOrientation();
    setRotated(true);
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  setTimeout(() => {
    if (showControls) {
      setShowControls(false);
    }
  }, 5000);

  const onGestureEvent = (event) => {
    setShowControls(true);
    
    try {
      const { translationX } = event?.nativeEvent;
      const {translationY, x} = event?.nativeEvent;

      // console.log(translationY);
      if (videoRef.current && translationX > 50) {
        const seekTime = currentPosition + translationX * 100;
        if (seekTime >= 0 && seekTime <= duration) {
          videoRef.current.setPositionAsync(seekTime);
          setSeekOffSet(translationX);
        } else if (translationX < -50) {
          videoRef.current.setPositionAsync(
            Math.max(0, duration + translationX * 100)
          );
        } else if(x < width / 2){
         console.log(translationY);
            const newBrightness = Math.max(0, Math.min(initialBrightness.current - translationY / 500, 1));
            Brightness.setBrightnessAsync(newBrightness);
            setBrightness(newBrightness);
        }
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
      if (res === duration) {
        videoRef.current.playFromPositionAsync(0);
      } else {
        setCurrentPosition(res);
        videoRef.current.playFromPositionAsync(res);
      }
    } else {
      console.log("Video Was Finished or It wasn't even started");
    }
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
          hitSlop={{ left: 0, right: 0, top: 0, bottom: 0 }}
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
              <VideoPlayerHeader video={video} setVisible={setVisible} pauseAt={pauseVideoAt} currentPosition={currentPosition} videoId={video.id} />
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
              }}
            />
            {showControls && (
              <>
                <Slider currentPosition={currentPosition} duration={duration} pauseVideo={pauseVideo} pauseVideoAt={pauseVideoAt} resumeVideo={resume} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />
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
