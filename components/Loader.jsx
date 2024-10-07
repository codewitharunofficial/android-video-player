import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'

const Loader = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}} >
      <ActivityIndicator color={'gray'} size={50} />
      <Text>Loading...</Text>
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})