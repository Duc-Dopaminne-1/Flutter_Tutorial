import * as React from 'react'
import { StyleSheet, View } from 'react-native'

type ARowProps = Readonly<{
  children: JSX.Element | JSX.Element[]
}>

export const ARow: React.SFC<ARowProps> = ({ children }) => {
  return <View style={styles.row}>{children}</View>
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
})
