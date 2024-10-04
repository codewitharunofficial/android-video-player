import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { BottomModal, ModalContent } from "react-native-modals";
import { Video } from "expo-av";
// import * as ScreenOrientation from "expo-screen-orientation";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";

const VideoPlayerScreen = ({ visible, setVisible, video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const height = Dimensions.get("screen").height;
  const width = Dimensions.get("screen").width;

  //   async function getOrientation(){
  //     const orientation = await ScreenOrientation.getOrientationAsync();
  //     // console.log(orientation);
  //   }

  // useEffect(() => {
  //   // getOrientation();
  //   ScreenOrientation.Orientation.LANDSCAPE_LEFT;
  // });

  const onGestureEvent = (event) => {
    console.log(event?.nativeEvent);
    try {
      const { translationX } = event?.nativeEvent;
      if (videoRef.current) {
        if (translationX > 50) {
          videoRef.current.setPositionAsync(
            Math.min(duration, translationX * 1000)
        );
        console.log("Fast Forwarding...!!");
        } else if (translationX < -50) {
          videoRef.current.setPositionAsync(
            Math.max(0, duration + translationX * 1000)
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BottomModal
      swipeDirection={["down", "up"]}
      onSwiping={() => setVisible(false)}
      visible={visible}
      style={{ width: width, height: height, padding: 0, backgroundColor: '#000' }}
    >
      <ModalContent style={{ width: "100%", height: "100%", margin: 0 }}>
        <GestureHandlerRootView style={{ width: "100%", height: "100%"}} >
        <PanGestureHandler style={{ width: "100%", height: "100%"}} onGestureEvent={(event) => onGestureEvent(event)}>
          <View style={{width: '100%', height: '100%', backgroundColor: '#000'}} >
            <Video
            ref={videoRef}
              source={{ uri: video?.uri }}
              resizeMode="contain"
              style={{ width: "100%", height: "100%" }}
              shouldPlay={true}
              onPlaybackStatusUpdate={(status) => {
                setDuration(status.durationMillis);
                setIsPlaying(status.isPlaying);
              }}
            />
            <Slider minimumValue={0} maximumValue={duration} maximumTrackTintColor="orange" minimumTrackTintColor="white" style={{width: "90%", alignSelf: 'center', justifyContent: 'center'}} />
          </View>
        </PanGestureHandler>
        </GestureHandlerRootView>
      </ModalContent>
    </BottomModal>
  );
};

export default VideoPlayerScreen;

const styles = StyleSheet.create({});
