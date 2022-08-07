import * as React from 'react'
import { StyleSheet, View } from 'react-native'

type ACameraTabProps = Readonly<{
  children: React.ReactNode
}>

export const ACameraTab: React.SFC<ACameraTabProps> = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
})
