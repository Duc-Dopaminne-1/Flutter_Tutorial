import * as React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import { LImage } from '@/libs/LImage'
import { colors } from '@/vars'
import { SafeImage } from '@/shared/image'

type Prop = Partial<{
  item: any
  layoutWidth: number
  openGallery: () => void
}>

type State = Partial<{}>
export class SupplierInfoImageItem extends React.PureComponent<Prop, State> {
  render():
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | React.ReactNodeArray
    | React.ReactPortal
    | boolean
    | null
    | undefined {
    const { openGallery, item, layoutWidth } = this.props

    const { uri, id } = new SafeImage(item)

    const layoutSize = layoutWidth
      ? this.props.layoutWidth
      : Dimensions.get('screen').width

    const containerStyle = {
      height: layoutSize,
      width: layoutSize,
    }

    return (
      <TouchableOpacity
        style={[styles.wrapImage, containerStyle]}
        onPress={openGallery}
        activeOpacity={1}
      >
        <LImage
          source={{
            id,
            uri,
          }}
          style={containerStyle as any}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  wrapImage: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
})
