import { Image, StyleSheet, View } from 'react-native'
import { colors, images } from '@/vars'
import * as React from 'react'

export const ARibbon: React.SFC<{}> = () => {
  return (
    <View style={styles.container}>
      <Image source={images.heart} style={styles.icon} />
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    transform: [{ rotate: '-45deg' }],
    backgroundColor: colors.warning,
    height: 17,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    left: -45,
    top: 10,
  },
  icon: {
    tintColor: colors.white,
    marginLeft: 17,
  },
})
