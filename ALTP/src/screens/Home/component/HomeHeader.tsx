import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { colors, images } from '@/vars'

export function HomeHeader(props: any) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapImage}>
        <Image source={images.spicker} style={styles.image} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    paddingTop: 20,
    marginRight: 20
  },
  wrapImage: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.white,
    padding: 3
  },
  image: {
    width: 23,
    height: 23,
    tintColor: colors.white
  }
})
