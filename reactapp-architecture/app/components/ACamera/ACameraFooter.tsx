import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { ACenter } from '@/components/ACenter/ACenter'

export type ACameraFooterProps = {
  containerStyle?: StyleProp<ViewStyle>
  onCapture: () => void
  imageData: string[]
  renderTop?(): React.ReactNode
  renderLeft?(): React.ReactNode
  renderRight?(): React.ReactNode
}

export type ACameraFooterState = Readonly<{}>

export class ACameraFooter extends React.Component<
  ACameraFooterProps,
  ACameraFooterState
> {
  // state
  readonly state = {}

  // default props
  static readonly defaultProps = {
    imageData: [],
  }

  renderCaptureButton = () => {
    const { onCapture } = this.props

    return (
      <ACenter>
        <TouchableOpacity onPress={onCapture}>
          <Image source={images.cameraCaptureButton} />
        </TouchableOpacity>
      </ACenter>
    )
  }

  render() {
    const { renderLeft, renderTop, renderRight, containerStyle } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {renderTop && renderTop()}

        <View style={styles.wrapper}>
          <ACenter>{renderLeft && renderLeft()}</ACenter>
          {this.renderCaptureButton()}
          <ACenter>{renderRight && renderRight()}</ACenter>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: metrics.camera_footer_height,
  },
  wrapper: {
    flex: 2,
    borderTopWidth: 1,
    borderColor: colors.medium_dark_grey,
    flexDirection: 'row',
  },
})
