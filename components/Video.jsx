import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Video } from 'expo-av';
import { TouchableOpacity } from 'react-native';
import VideoPlayerScreen from './VideoPlayerScreen';

const VideoComponents = ({video}) => {
  const [playVideo, setPlayVideo] = useState(false);
    // console.log(video);
  return (
    <>
    {
      playVideo && (
        <VideoPlayerScreen visible={playVideo} setVisible={setPlayVideo} video={video} />
      )
    }
    <TouchableOpacity onPress={() => setPlayVideo(true)} style={{width: '45%', height: '25%', padding: 10}} >
    {/* <Video source={{uri: video?.uri}} resizeMode='cover' usePoster={true} useNativeControls={false} style={{width: '100%', height: '90%', borderRadius: 20}} /> */}
    <Image source={{uri: video?.thumbnail ? video.thumbnail : null}} resizeMode='cover' style={{width: '100%', height: '70%', borderRadius: 10,}}  />
  <Text>{video?.filename}</Text>
</TouchableOpacity>
    </>
  )
}

export default VideoComponents;

const styles = StyleSheet.create({});