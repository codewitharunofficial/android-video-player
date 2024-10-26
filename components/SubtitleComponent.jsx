import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useContext, useMemo } from "react";
import { BottomModal } from "react-native-modals";
// import RadioGroup from "react-native-radio-buttons-group";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CurrentSubtitles } from "@/context/Subtitles";

const SubtitleComponent = ({
  visible,
  setVisible,
  subtitles,
  height,
  width,
}) => {
  // const { width, height } = Dimensions.get("window");

  const {currentSubtitle, setCurrentSubtitles} = useContext(CurrentSubtitles);

  // console.log(subtitles)

  // const radioButtons = useMemo(() => [subtitles], []);

  return (
    // <View style={styles.subtitleContainer}>
    //   <Text style={styles.subtitleText}>{currentSubtitle}</Text>
    // </View>

    <BottomModal
      directions={["down"]}
      styles={{
        backgroundColor: "#000",
        width: width,
        height: height,
      }}
      visible={visible}
      onSwipe={() => {
        setVisible(false);
        console.log("Swiped");
      }}
    >
      {subtitles?.length > 0 ? (
        subtitles?.map((track, index) => (
          <TouchableOpacity onPress={() => {setCurrentSubtitles(track); console.log("Selected")}} style={{height: 100, width: '100%', backgroundColor: 'transparent', padding: 10}} key={index} >
          <Text style={{color: 'black'}} >{track.title}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No subtitles available</Text>
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
