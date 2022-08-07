import { colors } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

export const SupplierCardSeparator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: colors.separator,
  },
})
