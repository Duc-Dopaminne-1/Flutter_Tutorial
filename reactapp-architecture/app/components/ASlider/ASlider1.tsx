import { colors, fonts, metrics, normalize } from '@/vars'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle, Text } from 'react-native'
import Modal, { ModalProps } from 'react-native-modal'
import Slider from 'react-native-slider'

type ASlider1Props = Readonly<{
  maximumRating: number
  currentRating: number
  star: string
}>

type ASlider1State = Readonly<{}>

export class ASlider1 extends React.PureComponent<
  ASlider1Props,
  ASlider1State
> {
  readonly state = {}

  static readonly defaultProps = {}

  render() {
    const { maximumRating, currentRating, star } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.star}>{star}</Text>

        <Slider
          value={currentRating}
          maximumValue={maximumRating}
          disabled={true}
          animateTransitions={true}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={colors.tracking_orange_yellow}
          style={styles.customSlider}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  star: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    color: colors.text_light_grey,
    marginRight: 7,
  },
  customSlider: {
    width: '80%',
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.background,
  },
  thumb: {
    width: 0,
    height: 18,
    borderRadius: 1,
  },
})
