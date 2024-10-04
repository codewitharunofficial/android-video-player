import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Video } from "expo-av";
import VideoComponents from "../components/Video";
import Folder from "../components/Folder";

const Home = () => {
  const [albums, setAlbums] = useState(null);
  const [videos, setVideos] = useState([]);

  // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissin Is Required");
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          const folders = await MediaLibrary.getAlbumsAsync();
        const albumContainingVideos = [];
        if (folders.length > 0) {
          for (const folder of folders) {
            const videos = await MediaLibrary.getAssetsAsync({
              album: folder.id,
              mediaType: "video",
              first: 1,
            });
            if (videos.totalCount > 0) {
              albumContainingVideos.push(folder);
            }
          }
        }
        setAlbums(albumContainingVideos);
        }
      } else {
        const folders = await MediaLibrary.getAlbumsAsync();
        const albumContainingVideos = [];
        if (folders.length > 0) {
          for (const folder of folders) {
            const videos = await MediaLibrary.getAssetsAsync({
              album: folder.id,
              mediaType: "video",
              first: 1,
            });
            if (videos.totalCount > 0) {
              albumContainingVideos.push(folder);
            }
          }
        }
        setAlbums(albumContainingVideos);
        // console.log(albumContainingVideos);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAlbums();
  });

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        padding: 10,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        gap: 10,
      }}
    >
      {albums?.length > 0 ? (
        albums?.map((item, idx) => <Folder assets={item} key={idx} />)
      ) : (
        <Text>No Videos Found on The Device</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
