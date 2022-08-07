import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { images, colors, metrics } from '@/vars'
import { ButtonBottom } from './ButtonBottom'
// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type GalleryPictureActionProps = {
  onPressEdit: () => void
  onPressMainPicture: () => void
  isMainPicture: boolean
} & DefaultProps

export type GalleryPictureActionState = Readonly<typeof initialState>

export class GalleryPictureAction extends React.PureComponent<
  GalleryPictureActionProps,
  GalleryPictureActionState
> {
  readonly state: GalleryPictureActionState = initialState

  static navigationOptions = {
    header: null,
  }

  render() {
    const { onPressEdit, onPressMainPicture, isMainPicture } = this.props

    return (
      <View style={styles.container}>
        <ButtonBottom
          onPress={onPressMainPicture}
          wrapimageStyle={styles.wrapImageLeft}
          imageStyle={[
            styles.imageLeft,
            isMainPicture && { tintColor: colors.yellow },
          ]}
          imagessrc={images.group}
        />

        <ButtonBottom
          onPress={onPressEdit}
          wrapimageStyle={styles.wrapImageRight}
          imageStyle={styles.imageRight}
          imagessrc={images.group2}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.gallery_picture_action_container_height,
    flexDirection: 'row',
  },
  wrapImageLeft: {
    marginHorizontal:
      metrics.gallery_picture_action_wrapImageLeft_marginHorizontal,
    marginBottom: metrics.gallery_picture_action_wrapImageLeft_marginBottom,
    marginTop: metrics.gallery_picture_action_wrapImageLeft_marginTop,
  },
  imageLeft: {
    height: metrics.gallery_picture_action_imageLeft_height,
    width: metrics.gallery_picture_action_imageLeft_width,
    marginLeft: metrics.gallery_picture_action_imageLeft_marginLeft,
  },
  wrapImageRight: {
    marginBottom: metrics.gallery_picture_action_wrapImageRight_marginBottom,
    marginTop: metrics.gallery_picture_action_wrapImageRight_marginTop,
  },
  imageRight: {
    height: metrics.gallery_picture_action_imageRight_height,
    width: metrics.gallery_picture_action_imageRight_width,
  },
})
