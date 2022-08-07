import { colors, metrics } from '@/vars'
import * as React from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { lCache } from '@/libs/LCache'
import { LImage } from '@/libs/LImage'
import { onStoreSuccess } from '@/services/global'
import { Subscription } from 'rxjs'
import { cameraStore } from '@/stores/cameraStore'

export type Props = Readonly<{
  animatedScale: Animated.Value
  onPress: () => void
}>

export type State = Readonly<{}>

export class CameraCapturedStack extends React.PureComponent<Props, State> {
  // variables
  subscription: Subscription

  // state
  readonly state = {
    images: [],
    id: '',
  }

  // default props
  static readonly defaultProps = {
    onPress: () => {},
  }

  componentDidMount() {
    this.subscription = cameraStore.observer.subscribe(this.initImage)
  }

  componentWillUnmount(): void {
    this.subscription && this.subscription.unsubscribe()
  }

  initImage = images => {
    const length = images.length - 1

    this.setState(
      {
        images,
        id: images && images[length] ? images[length].id : '',
      },
      () => {
        this.forceUpdate()
      }
    )
  }

  get checkImageAvailable() {
    const { images } = this.state

    return images && images.length > 0
  }

  get getImageLength() {
    return this.state.images.length
  }

  render() {
    const { onPress } = this.props
    const { id } = this.state

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.imageButton]}>
            {this.checkImageAvailable && (
              <LImage source={{ id, uri: '' }} style={styles.image} />
            )}
          </View>
          <View
            style={[
              styles.imageBoxBadge,
              this.checkImageAvailable && { backgroundColor: colors.red },
            ]}
          >
            <Text style={styles.text} numberOfLines={1}>
              {this.getImageLength}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    // flex: 1
  },
  imageButton: {
    height: metrics.image_box,
    width: metrics.image_box,
    borderRadius: 5,
    backgroundColor: colors.black_grey,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageBoxBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    bottom: -7,
    right: -7,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black_grey,
  },
  image: {
    width: 60,
    height: 60,
    overflow: 'hidden',
  },
  text: {
    color: colors.white,
  },
})
