import * as React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { images } from '@/vars'

type Props = {
  onPress?: () => void
  source?: number
}

export function ButtonImage(Props: Props) {
  const { onPress, source } = Props

  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={source} style={styles.image} resizeMode={'contain'} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 50,
    width: 60
  }
})
