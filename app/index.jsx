import {
  Dimensions,
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
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createThumbnail } from "react-native-create-thumbnail";
import * as Linking from 'expo-linking';
import { useRouter } from "expo-router";

const Home = () => {
  const [albums, setAlbums] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [url, setUrl] = useState(null);

  const router = useRouter();

  const { width, height } = Dimensions.get("window");

  async function getAlbums() {
    try {
      const { status } = await MediaLibrary.getPermissionsAsync();
      if (status !== "granted") {
        console.log("Permissin Is Required");
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
          setIsloading(true);
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
          // setIsloading(false);
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
        // setIsloading(false);
      }
    } catch (error) {
      console.log(error);
      setIsloading(false);
    }
  }

  const getAlbumThumbnail = async () => {
    try {
      for (let album of albums) {
        const data = await AsyncStorage.getItem(`${album.id}`);
        if (!data) {
          const video = await MediaLibrary.getAssetsAsync({
            album: album.id,
            mediaType: "video",
            first: 1,
          });
          // console.log(video.assets[0].uri);
          if (video.totalCount > 0) {
            const thumbnail = await createThumbnail({
              url: video.assets[0].uri,
              timeStamp: 1000,
            });
            // console.log(thumbnail.path);
            if (thumbnail) {
             await AsyncStorage.setItem(`${album.id}`, `${thumbnail.path}`);
             setIsloading(false);
            }
          }
        } 
      }
    } catch (error) {
      console.error(error);
      setIsloading(false);
    }
  };

  useEffect(() => {
    getAlbums();
  });

  useEffect(() => {
    if (albums?.length > 0) {
      getAlbumThumbnail();
    }
  }, [albums]);
  // console.log(albumThumbnail);


  const getUriAndFetchVideo = async (url) => {
    try {
          const video = await MediaLibrary.getAssetInfoAsync(url);
          if(video){
            console.log(video.filename);
            console.log(video.uri);
            router.push({pathname: '/videos/player', params: {uri: video.uri, title: video.filename, videoId: video.id}})
          }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if(url){
        setUrl(url);
      }
    })
  }, []);

  useEffect(() => {
    if(url){
      getUriAndFetchVideo(url);
    }
  }, [url])


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
      {!isLoading && albums?.length < 1 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, fontWeight: "400" }}>
            No Videos Found on The Device
          </Text>
        </View>
      ) : (
        albums?.map((item, idx) => <Folder assets={item} key={idx}  />)
      )}
      {/* <TouchableOpacity
        style={{
          position: "absolute",
          bottom: (height * 1) / 15,
          right: (width * 1) / 15,
          backgroundColor: "royalblue",
          padding: 10,
          borderRadius: 50,
          zIndex: 1,
        }}
      >
        <AntDesign name="play" size={40} color={"white"} />
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
