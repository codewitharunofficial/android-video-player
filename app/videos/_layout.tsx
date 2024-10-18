import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name='index' options={{title: "Videos", headerTitleAlign: 'center', headerShown: true}} /> 
        <Stack.Screen name='player' options={{title: "Player", headerTitleAlign: 'center', headerShown: false}}  />
    </Stack>
  )
}

export default _layout