import { View, Text, StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ModalPortal } from "react-native-modals";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { PlayerScreenProvider } from "@/context/PlayerScreenContext";
import { SubtitleProvider } from "@/context/Subtitles";

const _layout = () => {
  return (
    // <PlayerScreenProvider>
    <GestureHandlerRootView style={{flex: 1}} >
      {/* <StatusBar /> */}
      <SubtitleProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerTitleAlign: "center",
            // headerStyle: { backgroundColor: "cyan" },
          }}
        />
        <Stack.Screen
          name="videos"
          options={{ title: "Videos", headerTitleAlign: "center", headerShown: false }}
        />
        {/* <Stack.Screen
          name="video/player"
          options={{ title: "Player", headerTitleAlign: "center", headerShown: false }}
        /> */}
      </Stack>
      </SubtitleProvider>
      <ModalPortal />
    </GestureHandlerRootView>
    // </PlayerScreenProvider>
  );
};

export default _layout;
