import { StyleSheet, Text } from "react-native";
import React, { useContext } from "react";
import { BottomModal } from "react-native-modals";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

const SubtitleComponent = ({
  visible,
  setVisible,
  subtitles,
  height,
  width,
  setCurrentSubtitles,
  setEnableSubtitles
}) => {

  // console.log(subtitles[0])

  return (
    <BottomModal
      swipeDirection={['down']}
      modalStyle={{width: width, height: height/ 5, backgroundColor: 'rgba(250, 250, 250, 0.2)'}}
      visible={visible}
      onSwiping={() => setVisible(!visible)}
    >
      {subtitles?.length > 0 ? (
        subtitles?.map((track, index) => (
          <TouchableOpacity onPress={() => {setCurrentSubtitles(track?.index); setEnableSubtitles(true)}} style={{height: 70, width: '100%', backgroundColor: 'transparent', padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#fff'}} key={index} >
          <Text style={{color: '#fff', fontSize: 20}} >{track.title}</Text>
          {
            track.selected && (
              <AntDesign name="check" color={'green'} size={20} />
            )
          }
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{alignSelf: 'center', color: '#fff', fontSize: 20}} >No subtitles available</Text>
      )}
    </BottomModal>
  );
};

export default SubtitleComponent;

const styles = StyleSheet.create({
  subtitleContainer: {
    position: "absolute",
    bottom: "20%",
    left: 10,
    right: 10,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  subtitleText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});
