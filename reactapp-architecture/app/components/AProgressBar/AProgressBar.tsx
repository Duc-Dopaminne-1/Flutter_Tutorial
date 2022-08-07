import { colors } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

type AProgressBarProps = Readonly<{
  value: number
}>

export class AProgressBar extends React.PureComponent<AProgressBarProps> {
  static readonly defaultProps = {
    value: 0,
  }

  render(): React.ReactNode {
    return (
      <>
        <View style={styles.outer}>
          <View style={[styles.inner, { width: this.props.value + '%' }]} />
        </View>
      </>
    )
  }
}

const styles = StyleSheet.create({
  outer: {
    height: 16,
    backgroundColor: colors.pale_grey,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  inner: {
    height: 16,
    backgroundColor: colors.validated,
  },
})
