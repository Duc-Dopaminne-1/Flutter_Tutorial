import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export type ACameraTabButtonProps = {
  onChangeType(): void
  selected: boolean
  label: string
}

export class ACameraTabButton extends React.PureComponent<
  ACameraTabButtonProps
> {
  render() {
    const { onChangeType, selected, label } = this.props

    return (
      <TouchableOpacity onPress={onChangeType} style={styles.button}>
        <Text style={[styles.buttonText, selected && { color: colors.yellow }]}>
          {label.toUpperCase()}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fonts.size.m,
  },
})
