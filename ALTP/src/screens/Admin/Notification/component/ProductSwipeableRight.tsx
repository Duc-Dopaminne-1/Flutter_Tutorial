import { colors, images } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

type ProductSwipeableRightProp = {
  onPressDelete: () => void
}

type ProductSwipeableRightState = Readonly<{}>

export class ProductSwipeableRight extends React.PureComponent<
  ProductSwipeableRightProp,
  ProductSwipeableRightState
> {
  widthSwipeRight = 99

  static readonly defaultProps = {}

  readonly state: ProductSwipeableRightState = {}

  render() {
    const { onPressDelete } = this.props

    return (
      <RectButton
        style={[styles.rightAction, { width: this.widthSwipeRight }]}
        onPress={() => onPressDelete()}>
        <Image
          source={images.icon_message_highlight}
          style={styles.swipeRightImage}
        />
        <Text style={styles.swipeRightText}>Notification</Text>
      </RectButton>
    )
  }
}

const styles = StyleSheet.create<any>({
  swipeRightText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white
  },
  swipeRightImage: {
    height: 21,
    width: 20,
    tintColor: colors.white,
    marginBottom: 7
  },
  rightAction: {
    backgroundColor: colors.light_green,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
