import * as React from 'react'
import { Animated, Platform, StyleSheet, Text, View } from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import I18n from '@/i18n'
import { onProductCreated } from '@/services/global'
import { delay } from 'rxjs/operators'
import { imageStore } from '@/stores/imageStore'
import { Subscription } from 'rxjs'
import { imageStore3 } from '@/stores/imageStore3'
import { LImage } from '@/libs/LImage'

type Props = Readonly<{
  height: number
}>

type State = Readonly<{
  isVisible: boolean
  totalProduct: number
  id: string
}>

export class AToast extends React.PureComponent<Props, State> {
  _fadeAnim = new Animated.Value(1)
  _moveAnim = new Animated.Value(-140)
  _subscription: Subscription

  readonly state: State = {
    isVisible: false,
    totalProduct: 1,
    id: '',
  }

  static defaultProps = {
    height: 0,
  }

  componentDidMount(): void {
    this._subscription = onProductCreated.pipe(delay(200)).subscribe(value => {
      const id = imageStore3.thumbnailId()

      this.setState(
        {
          id,
          totalProduct: value.total,
        },
        () => {
          this.show()
          // imageStore3.clear()
        }
      )
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
  }

  show = () => {
    this.setState({ isVisible: true })

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this._fadeAnim, {
          toValue: 1,
          duration: 800,
        }),
        Animated.timing(this._moveAnim, {
          toValue: 0,
          duration: 1200,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(this._moveAnim, {
        toValue: 10,
        duration: 500,
      }),
      Animated.parallel([
        Animated.timing(this._fadeAnim, {
          toValue: 0,
          duration: 800,
        }),
        Animated.timing(this._moveAnim, {
          toValue: -140,
          duration: 1200,
        }),
      ]),
    ]).start(() => {
      this.setState(
        {
          isVisible: false,
        },
        () => {
          imageStore.thumbnail = ''
        }
      )
    })
  }

  render() {
    const { height } = this.props
    const { isVisible, id, totalProduct } = this.state

    if (!isVisible) {
      return null
    }

    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: metrics.product_screen_Toast_container_bottom,
            right: metrics.product_screen_Toast_container_right,
          },
          {
            marginBottom: height,
            opacity: this._fadeAnim,
            marginRight: this._moveAnim,
          },
        ]}
      >
        <View
          style={[
            styles.container,
            // Platform.select({
            //   android: styles.shadowAndroid,
            //   ios: styles.shadowIos,
            // }),
          ]}
        >
          <View style={{ overflow: 'hidden' }}>
            <LImage source={{ id, uri: '' }} style={styles.image} />
            <View style={styles.wrapTextSave}>
              <Text style={styles.textSave}>{I18n.t('saved')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.wrapTextTotal}>
          <Text style={styles.textTotal}>{totalProduct}</Text>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    width: metrics.product_screen_Toast_container_width,
    height: metrics.product_screen_Toast_container_height,
    padding: metrics.product_screen_Toast_container_padding,
    borderRadius: metrics.product_screen_Toast_container_borderRadius,
    backgroundColor: colors.white,
    position: 'absolute',
    bottom: metrics.product_screen_Toast_container_bottom,
    right: metrics.product_screen_Toast_container_right,
    zIndex: 0,
  },
  wrapTextTotal: {
    position: 'absolute',
    top: metrics.product_screen_Toast_wrapText_top,
    right: metrics.product_screen_Toast_wrapText_right,
    width: metrics.product_screen_Toast_wrapText_width,
    height: metrics.product_screen_Toast_wrapText_height,
    backgroundColor: colors.pink_red,
    borderRadius: metrics.product_screen_Toast_wrapText_borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  textTotal: {
    color: colors.white,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
  },
  textSave: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
  shadowIos: {
    shadowOpacity: 0.1,
    shadowOffset: { height: 0, width: 0 },
  },
  shadowAndroid: {
    elevation: metrics.product_screen_Toast_shadowAndroid_elevation,
  },
  image: {
    height: metrics.product_screen_Toast_height,
    width: metrics.product_screen_Toast_width,
    // overflow: 'hidden',
  },
  wrapTextSave: {
    backgroundColor: colors.validated,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
