import * as React from 'react'
import {
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  ImageRequireSource,
} from 'react-native'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type GalleryPictureActionProps = {
  onPress: () => void
  imagessrc: ImageRequireSource
  imageStyle?: StyleProp<ImageStyle>
  wrapimageStyle?: StyleProp<ViewStyle>
} & DefaultProps

export type GalleryPictureActionState = Readonly<typeof initialState>

export class ButtonBottom extends React.PureComponent<
  GalleryPictureActionProps,
  GalleryPictureActionState
> {
  readonly state: GalleryPictureActionState = initialState

  render() {
    const { onPress, imageStyle, wrapimageStyle, imagessrc } = this.props

    return (
      <TouchableOpacity style={wrapimageStyle} onPress={onPress}>
        <Image source={imagessrc} style={imageStyle} />
      </TouchableOpacity>
    )
  }
}
