import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";

const width = Dimensions.get('window').width;
const Folder = ({ assets }) => {
  

  return (
    <TouchableOpacity style={styles.view}>
      <Link href={{pathname: '/videos', params: {albumId: assets.id}}}>
      <Ionicons name="albums" size={100} color={"#000"} />
      </Link>
      <Text style={{ color: "black" }}>{assets.title?.slice(0, 40)}</Text>
    </TouchableOpacity>
  );
};

export default Folder;

const styles = StyleSheet.create({
  view: {
    width: width / 2 - 10,
    height: 200,
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "gray",
    padding: 10,
    justifyContent: "center",
  },
});
