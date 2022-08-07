import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { LImage } from '@/libs/LImage'
import { metrics } from '@/vars'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'

type Prop = Partial<{
  uri: any
  id: any
  onDoubleTapAfter?: (
    event: any,
    gestureState: any,
    zoomAbleViewEventObject: any
  ) => void
  onZoomAfter?: () => void
  onPanResponder?: (
    event: any,
    gestureState: any,
    zoomAbleViewEventObject: any
  ) => void
}>

type State = Partial<{}>

export class GalleryPictureImage extends React.PureComponent<Prop, State> {
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
    const {
      uri,
      id,
      onDoubleTapAfter,
      onZoomAfter,
      onPanResponder,
    } = this.props

    return (
      <View style={styles.wrapImage}>
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          style={styles.wrapImage}
          doubleTapDelay={200}
          onDoubleTapAfter={onDoubleTapAfter} // double click
          onZoomAfter={onZoomAfter} // zoom
          onPanResponderEnd={onPanResponder} // move
          pinchToZoomInSensitivity={4}
          pinchToZoomOutSensitivity={4}
        >
          <LImage
            source={{
              id,
              uri,
            }}
            style={styles.image}
            scaleMode={'scaleAspectFit'}
          />
        </ReactNativeZoomableView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapImage: {
    flex: 1,
  },
  image: {
    height: metrics.screen_height - 162,
    width: metrics.screen_width,
  },
})
