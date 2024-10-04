import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { ModalPortal } from "react-native-modals";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const _layout = () => {
  return (
    <GestureHandlerRootView>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="videos"
          options={{ title: "Videos", headerTitleAlign: "center" }}
        />
      </Stack>
      <ModalPortal />
    </GestureHandlerRootView>
  );
};

export default _layout;
