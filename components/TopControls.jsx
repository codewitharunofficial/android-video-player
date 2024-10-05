import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

const TopControls = () => {
  return (
    <View style={{width: '30%', height: '10%', backgroundColor: 'transparent', position: 'absolute', top: '10%', zIndex: 1, alignItems: 'center', alignSelf: 'flex-end', paddingHorizontal: 20, flexDirection: 'row', gap: 20}} >
      <MaterialIcons name='music-note' size={20} color={'white'} />
      <MaterialIcons name='subtitles' size={20} color={'white'} />
      <MaterialCommunityIcons name='crop-rotate' size={20} color={'white'} />
    </View>
  )
}

export default TopControls

const styles = StyleSheet.create({})