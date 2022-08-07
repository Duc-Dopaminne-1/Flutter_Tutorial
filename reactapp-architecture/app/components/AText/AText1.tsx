import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

export type AText1Props = {
  title: string
  containerStyle?: StyleProp<ViewStyle>
}

export class AText1 extends React.PureComponent<AText1Props> {
  static defaultProps = {}

  render() {
    const { title, containerStyle } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingHorizontal: 12,
    backgroundColor: colors.pale_grey_40,
    height: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.primary_blue,
  },
})
