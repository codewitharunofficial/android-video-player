import { StyleSheet, Text } from "react-native";
import React, { useContext } from "react";
import { BottomModal } from "react-native-modals";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const AudioTracksComponent = ({
  visible,
  setVisible,
  audioTracks,
  height,
  width,
  setCurrentAudioTracks,
}) => {

  // console.log(audioTracks)

  return (
    <BottomModal
      swipeDirection={['down']}
      modalStyle={{width: width, height: height/ 5, backgroundColor: 'rgba(250, 250, 250, 0.2)'}}
      visible={visible}
      onSwiping={() => setVisible(!visible)}
    >
      {audioTracks?.length > 0 ? (
        audioTracks?.map((track, index) => (
          <TouchableOpacity onPress={() => {setCurrentAudioTracks(track?.index)}} style={{height: 70, width: '100%', backgroundColor: 'transparent', padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'lightgray'}} key={index} >
          <Text style={{color: '#fff', fontSize: 20}} >{track.title !== null ? track.title : "Default"}</Text>
          {
            track.selected && (
              <AntDesign name="check" color={'green'} size={20} />
            )
          }
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{alignSelf: 'center', color: '#fff', fontSize: 20}} >No audio tracks available</Text>
      )}
    </BottomModal>
  );
};

export default AudioTracksComponent;

const styles = StyleSheet.create({});
