import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { Subscription } from 'rxjs'
import { Dimension, Orientation } from '@/services/dimension'

export type ACameraGridProps = Readonly<{
  height?: number
}>

export type ACameraGridState = Readonly<{}>

export class ACameraGrid extends React.PureComponent<
  ACameraGridProps,
  ACameraGridState
> {
  _subscription: Subscription

  // state
  readonly state = {
    dimension: Dimension.currentMode,
    gridWidth: Dimension.select({
      portrait: Dimensions.get('screen').width - 40,
      landscape: Dimensions.get('screen').height / 1.65,
    }),
  }

  static readonly defaultProps = {
    // height: metrics.width_for_camera_portrait,
  }

  componentDidMount() {
    this._subscription = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        const dim = Dimensions.get('screen')
        this.setState({
          dimension: value,
          gridWidth:
            value === Orientation.Portrait ? dim.width - 40 : dim.height / 1.65,
        })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  render() {
    const { gridWidth } = this.state
    const height = this.props.height ? this.props.height : gridWidth

    return (
      <View style={styles.container}>
        <View style={styles.opacity} />

        {/* +1 height to avoid from rendering empty thin space */}
        <View style={[styles.wrapMiddle, { height: height + 1 }]}>
          <View style={styles.opacity} />

          <View style={{ height, width: gridWidth }}>
            <View style={styles.topLeftArrow}>
              <Image source={images.rightChevron} style={styles.icon} />
            </View>

            <View style={styles.topRightArrow}>
              <Image source={images.rightChevron} style={styles.icon} />
            </View>

            <View style={styles.bottomLeftArrow}>
              <Image source={images.rightChevron} style={styles.icon} />
            </View>

            <View style={styles.bottomRightArrow}>
              <Image source={images.rightChevron} style={styles.icon} />
            </View>

            <View style={styles.center}>
              <Image source={images.cameraPlus} style={styles.icon} />
            </View>
          </View>

          <View style={styles.opacity} />
        </View>

        <View style={styles.opacity} />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
  icon: {
    width: metrics.camera_icon,
    height: metrics.camera_icon,
    tintColor: colors.white,
  },
  topLeftArrow: {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: [{ rotate: '225deg' }],
  },
  topRightArrow: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: [
      {
        rotate: '315deg',
      },
    ],
  },
  bottomLeftArrow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    transform: [
      {
        rotate: '495deg',
      },
    ],
  },
  bottomRightArrow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    transform: [
      {
        rotate: '405deg',
      },
    ],
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacity: {
    flex: 1,
    opacity: 0.5,
    backgroundColor: 'black',
  },
  wrapMiddle: {
    flexDirection: 'row',
  },
})
