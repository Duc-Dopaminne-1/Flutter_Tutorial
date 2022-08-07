import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts, metrics } from '@/vars'

type Prop = Partial<{
  count: string
}>

type State = Partial<{}>

export class GalleryPictureImageCount extends React.PureComponent<Prop, State> {
  render() {
    const { count } = this.props

    return (
      <View style={styles.wrapNumberOfImage}>
        <Text style={styles.text}>{count}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapNumberOfImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue_grey,
    padding: metrics.gallery_picture_screen_wrapNumberOfImage_padding,
    borderRadius: metrics.gallery_picture_screen_wrapNumberOfImage_borderRadius,
    marginRight: metrics.medium_base,
    marginBottom: metrics.medium_base,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.s,
  },
})
