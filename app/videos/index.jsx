import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import VideoComponents from "../../components/Video";
import { createThumbnail } from "react-native-create-thumbnail";
import { FlatList } from "react-native-gesture-handler";
import Loader from "@/components/Loader";

const VideosList = () => {
  const { albumId } = useLocalSearchParams();
  const [videos, setVideos] = useState();
  const [isLoading, setIsLoading] = useState(false);
  async function getAssetsFromAlbum() {
    setIsLoading(true);
    try {
      const videoAssets = await MediaLibrary.getAssetsAsync({
        album: albumId,
        mediaType: "video",
      });

      // setVideos(videoAssets.assets);
      generateDefaultThumbnail(videoAssets.assets);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAssetsFromAlbum();
  }, []);

  const videosWithThumbnail = [];

  async function generateDefaultThumbnail(videoList) {
    try {
      for (let video of videoList) {
        const thumbnail = await createThumbnail({
          url: video.uri,
          timeStamp: 10000,
        });
        // video.thumbnail = thumbnail.path;
        video = Object.assign(video, { thumbnail: thumbnail.path });
        videosWithThumbnail.push(video);
      }
      setVideos(videosWithThumbnail);
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  }


  const height = Dimensions.get("screen").height;

  return isLoading ? (
    <Loader />
  ) : (
    <ScrollView
      scrollEnabled={true}
      contentContainerStyle={{
        justifyContent: "space-between",
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {videos?.length > 0 &&
        videos?.map((vid, idx) => <VideoComponents key={idx} video={vid} />)}
    </ScrollView>
  );
};

export default VideosList;

const styles = StyleSheet.create({});
