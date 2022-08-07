import { colors, metrics } from '@/vars'
import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

export type AControlProps = {
  children: JSX.Element | JSX.Element[]
  containerStyle?: StyleProp<ViewStyle>
}

export const AControl: React.SFC<AControlProps> = ({
  children,
  containerStyle,
}) => {
  return <View style={[styles.container, containerStyle]}>{children}</View>
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: metrics.acontrol_padding_vertical,
    borderColor: colors.border_primary,
    borderTopWidth: metrics.acontrol_border_top_width,
    borderBottomWidth: metrics.acontrol_border_bottom_width,
  },
})
