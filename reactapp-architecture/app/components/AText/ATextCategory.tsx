import { colors } from '@/vars'
import * as React from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'

export type ATextCategory = {
  primaryText: string
  secondaryText: string

  primaryStyle?: StyleProp<TextStyle>
  secondaryStyle?: StyleProp<TextStyle>
  dotStyle?: StyleProp<TextStyle>
  spacer?: 'top' | 'bottom' | null
  spaceSize?: number
  primaryProps?: TextProps
  secondaryProps?: TextProps
}

export const ATextCategory: React.SFC<ATextCategory> = ({
  primaryText,
  secondaryText,
  primaryStyle,
  secondaryStyle,
  spacer,
  spaceSize,
  dotStyle,
  primaryProps,
}) => {
  if (!(primaryText || secondaryText)) return null

  return (
    <Text
      numberOfLines={2}
      style={[
        styles.primary,
        spacer && {
          [spacer === 'top' ? 'marginTop' : 'marginBottom']: spaceSize,
        },
        primaryStyle,
      ]}
      {...primaryProps}
    >
      {primaryText}
      {primaryText &&
        secondaryText && <Text style={[styles.dot, dotStyle]}>{'  •  '}</Text>}
      <Text style={[styles.secondary, secondaryStyle]} numberOfLines={2}>
        {secondaryText}
      </Text>
    </Text>
  )
}

ATextCategory.defaultProps = {
  spacer: 'top',
  spaceSize: 7,
}

const styles = StyleSheet.create({
  primary: {
    color: colors.text_flower_pot,
  },
  dot: {
    color: colors.light_blue_grey,
  },
  secondary: {
    color: colors.medium_gray,
  },
})
