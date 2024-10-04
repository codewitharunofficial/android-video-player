import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import VideoComponents from "../../components/Video";
import { createThumbnail } from "react-native-create-thumbnail";

const VideosList = () => {
  const { albumId } = useLocalSearchParams();
  const [videos, setVideos] = useState();
  async function getAssetsFromAlbum() {
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
        video = Object.assign(video, {thumbnail: thumbnail.path});
        videosWithThumbnail.push(video);
      }
      setVideos(videosWithThumbnail);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      scrollEnabled={true}
      scrollToOverflowEnabled={true}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "auto",
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
      }}
    >
      {videos?.length > 0 &&
        videos?.map((vid, idx) => <VideoComponents key={idx} video={vid} />)}
    </ScrollView>
  );
};

export default VideosList;

const styles = StyleSheet.create({});
