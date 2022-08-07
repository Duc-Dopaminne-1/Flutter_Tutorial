import { colors, fonts } from '@/vars'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { MaterialIndicator } from 'react-native-indicators'

export type AIndicator = {
  full?: boolean
  backgroundColor?: string
  color?: string
  size?: number
  containerStyle?: any
  text?: string
}

export const AIndicator: React.SFC<AIndicator> = ({
  full,
  backgroundColor,
  color,
  size,
  containerStyle,
  text,
}) => {
  const container = full ? [style.fullScreen, { backgroundColor }] : null
  const hasText = text.length > 0
  return (
    <View style={[container, containerStyle]}>
      <View style={{ height: size }}>
        <MaterialIndicator
          size={size}
          color={color ? color : colors.primary_blue}
        />
      </View>

      {hasText && <Text style={style.text}>{text}</Text>}
    </View>
  )
}

AIndicator.defaultProps = {
  backgroundColor: colors.transparent,
  size: 40,
  text: '',
}

const style = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
    marginTop: 27,
  },
})
