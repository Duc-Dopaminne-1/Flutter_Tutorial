import { colors, metrics } from '@/vars'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export const AModalTabExpand = () => {
  return <View style={[styles.button]} />
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    width: metrics.screen_width / 2.25,
    margin: 3,
    backgroundColor: colors.transparent,
  },
})
