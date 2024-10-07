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
import Loader from "@/components/Loader";

const Home = () => {
  const [albums, setAlbums] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  // const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  async function getAlbums() {
    try {
      setIsloading(true);
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
          setIsloading(false);
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
        setIsloading(false);
      }
    } catch (error) {
      console.log(error);
      setIsloading(false);
    }
  }

  useEffect(() => {
    getAlbums();
  });

  return isLoading ? (
    <Loader />
  ) : (
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
      {!isLoading && albums?.length > 0 ? (
        albums?.map((item, idx) => <Folder assets={item} key={idx} />)
      ) : (
        <Text style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}>
          No Videos Found on The Device
        </Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
