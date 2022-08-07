import { metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Platforms } from '@/shared/platforms'

type Props = Readonly<{
  children: JSX.Element | JSX.Element[]
}>

export const SupplierInfoForm: React.SFC<Props> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.light_white_gray,
  },
  wrapper: {
    marginTop: metrics.base,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingTop: metrics.keylines_screen_edge_margin,
    ...Platforms.shared().select({
      android: {
        borderRadius: metrics.supplier_border_radius,
      },
      ios: {
        borderRadius: metrics.supplier_border_radius,
      },
    }),
  },
})
