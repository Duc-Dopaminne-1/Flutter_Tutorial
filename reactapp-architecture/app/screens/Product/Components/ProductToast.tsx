import * as React from 'react'
import { Animated, Platform, StyleSheet, Text } from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import { imageStore } from '@/stores/imageStore'
import { Toast } from '@/services/global'
import { Subscription } from 'rxjs'

type Props = Readonly<{}>

type State = Readonly<{
  isVisible: boolean
  message: string
}>

export class ProductToast extends React.PureComponent<Props, State> {
  _fadeAnim = new Animated.Value(1)
  _subscription: Subscription
  readonly state: State = {
    message: '',
    isVisible: false,
  }

  componentDidMount(): void {
    this._subscription = Toast.subscribe(data => {
      this.show(data)
    })
  }

  componentWillMount(): void {
    this._subscription && this._subscription.unsubscribe()
  }

  show = data => {
    this.setState({ isVisible: true, message: data.message.toString() })
    this.animation()
  }

  animation = () => {
    Animated.sequence([
      Animated.timing(this._fadeAnim, {
        toValue: 1,
        duration: 700,
      }),
      Animated.delay(1000),
      Animated.timing(this._fadeAnim, {
        toValue: 0,
        duration: 700,
      }),
    ]).start(() => {
      this.setState({ isVisible: false })
    })
  }
  render() {
    const {} = this.props
    const { isVisible, message } = this.state

    if (!isVisible) {
      return null
    }

    return (
      <Animated.View
        style={[
          styles.container,
          Platform.select({
            android: styles.shadowAndroid,
            ios: styles.shadowIos,
          }),
          {
            opacity: this._fadeAnim,
          },
        ]}
      >
        <Text style={styles.textTotal}>{message}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    borderRadius: 4,
    backgroundColor: colors.black08,
    position: 'absolute',
    bottom: 90,
    right: 24,
    left: 24,
    height: 52,
    justifyContent: 'center',
    elevation: metrics.base,
  },
  textTotal: {
    color: colors.white,
    fontSize: fonts.size.l,
    alignSelf: 'center',
  },
})
