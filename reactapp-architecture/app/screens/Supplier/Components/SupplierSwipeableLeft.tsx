import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { RectButton } from 'react-native-gesture-handler'
import { Image, View, StyleSheet } from 'react-native'
import { colors, images } from '@/vars'
import { Subscription } from 'rxjs'
import { isSelectMulti } from '@/services/global'

type Props = {
  isSelect: boolean
  onSelect: () => void
} & Partial<NavigationInjectedProps<{}>>

type State = Readonly<{
  isSelect: boolean
}>

export class SupplierSwipeableLeft extends React.PureComponent<Props, State> {
  selectMulti: Subscription

  static readonly defaultProps = {}

  readonly state: State = {
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
    const { isSelect } = this.state

    return (
      <RectButton
        style={styles.leftAction}
        onPress={() => {
          onSelect()
          this.setState({ isSelect: !this.state.isSelect })
        }}
      >
        {isSelect ? (
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
