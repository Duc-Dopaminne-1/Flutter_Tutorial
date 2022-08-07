import { AButton } from '@/components/AButton/AButton'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet } from 'react-native'

type AModalTabButtonProps = {
  title: string
  unit: string
  value: string
  onSelect: (unit: string) => void
}

export const AModalTabButton: React.SFC<AModalTabButtonProps> = ({
  title,
  unit,
  value,
  onSelect,
}) => {
  const checkCurrentUnit = (key: string) => {
    return value === key
  }

  return (
    <AButton
      title={title}
      onPress={() => {
        onSelect(unit)
      }}
      containerStyle={[
        styles.button,
        checkCurrentUnit(unit) && {
          backgroundColor: colors.primary_blue,
        },
      ]}
      titleStyle={[
        styles.buttonText,
        checkCurrentUnit(unit) && { color: colors.white },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    height: 46,
    width: metrics.screen_width / 2.25,
    backgroundColor: colors.pale_grey,
    margin: 3,
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.blue_light_grey,
  },
})
