import { colors, images } from '@/vars'
import * as React from 'react'
import { Animated, Image, StyleSheet, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { NavigationInjectedProps } from 'react-navigation'
import { isSelectMulti } from '@/services/global'
import { Subscription } from 'rxjs'

type ProductSwipeableLeftProp = {
  isSelect: boolean
  onSelect: () => void
} & Partial<NavigationInjectedProps<{}>>

type ProductSwipeableLefttState = Readonly<{
  isSelect: boolean
}>

export class ProductSwipeableLeft extends React.PureComponent<
  ProductSwipeableLeftProp,
  ProductSwipeableLefttState
> {
  selectMulti: Subscription
  static readonly defaultProps = {}

  readonly state: ProductSwipeableLefttState = {
    isSelect: false,
  }

  componentDidMount(): void {
    this.selectMulti = isSelectMulti.subscribe(data => {
      this.setState({ isSelect: data })
    })
  }

  componentWillUnmount(): void {
    this.selectMulti && this.selectMulti.unsubscribe()
  }

  render() {
    const { onSelect } = this.props

    return (
      <RectButton
        style={styles.leftAction}
        onPress={() => {
          onSelect()
          this.setState({ isSelect: !this.state.isSelect })
        }}
      >
        {this.state.isSelect ? (
          <Image source={images.checked} style={styles.swipeLeftImage} />
        ) : (
          <View style={styles.swipeLeftView} />
        )}
      </RectButton>
    )
  }
}

const styles = StyleSheet.create<any>({
  swipeLeftView: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderColor: colors.light_blue_grey,
    borderWidth: 1,
  },
  leftAction: {
    width: 90,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeLeftImage: {
    height: 24,
    width: 24,
    tintColor: colors.primary_blue,
  },
})
