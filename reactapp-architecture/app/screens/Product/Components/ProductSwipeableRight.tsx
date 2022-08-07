import { colors, images } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import I18n from '@/i18n'
import { NavigationInjectedProps } from 'react-navigation'

type ProductSwipeableRightProp = {
  onPressDelete: () => void
} & Partial<NavigationInjectedProps<{}>>

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
        onPress={() => onPressDelete()}
      >
        <Image source={images.trash} style={styles.swipeRightImage} />
        <Text style={styles.swipeRightText}>{I18n.t('delete')}</Text>
      </RectButton>
    )
  }
}

const styles = StyleSheet.create<any>({
  swipeRightText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
  },
  swipeRightImage: {
    height: 21,
    width: 20,
    tintColor: colors.white,
    marginBottom: 7,
  },
  rightAction: {
    backgroundColor: colors.pink_red,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
