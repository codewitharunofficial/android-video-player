import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";

const {width, height} = Dimensions.get("window");
const Folder = ({ assets }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [albumSize, setAlbumSize] = useState(0);

  const router = useRouter();

  const getThumbnail = async () => {
    try {
      const data = await AsyncStorage.getItem(`${assets.id}`);
      if (data) {
        setThumbnail(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getThumbnail();
  }, []);

  async function getNumberOfVideos(){
    try {
      const videos = await MediaLibrary.getAssetsAsync({
        album: assets.id,
        mediaType: 'video'
      });
      if(videos.totalCount > 0){
        // console.log(videos.assets.length);
         return videos.assets.length;
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getNumberOfVideos();
  }, []);

  return (
    // <Link href={{ pathname: "/videos", params: { albumId: assets.id } }}>
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/videos", params: { albumId: assets.id } })
      }
      style={styles.view}
    >
      <Image
        source={{ uri: thumbnail ? thumbnail : `${require("@/assets/images/icon.png")}` }}
        resizeMode="cover"
        style={{ width: width/2 - 15, height: height / 6, borderRadius: 10 }}
      />
      <Text
        numberOfLines={1}
        style={{ color: "black", fontWeight: "600", fontSize: 16, alignSelf: 'flex-start' }}
      >
        {assets.title?.slice(0, 40)}
      </Text>
      <Text
        numberOfLines={1}
        style={{ color: "lightgray", fontSize: 12, alignSelf: 'flex-start' }}
      >
      {albumSize}
      </Text>
    </TouchableOpacity>
    // </Link>
  );
};

export default Folder;

const styles = StyleSheet.create({
  view: {
    width: width / 2 - 15,
    height: height / 4 -20,
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    // borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    paddingHorizontal: 5,
  },
});
