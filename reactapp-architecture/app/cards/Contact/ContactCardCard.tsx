import { AIcon } from '@/components/AIcon/AIcon'
import { colors, images } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

export const ContactCardCard = () => {
  return (
    <View style={styles.outer}>
      <AIcon source={images.businessCard} size={20} />
    </View>
  )
}

const styles = StyleSheet.create({
  outer: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
