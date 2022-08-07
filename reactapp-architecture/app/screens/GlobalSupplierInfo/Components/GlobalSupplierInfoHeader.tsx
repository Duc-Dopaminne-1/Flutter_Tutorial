import { GlobalSupplierInfoHeaderAction } from './GlobalSupplierInfoHeaderAction'
import { GlobalSupplierInfoHeaderTitle } from './GlobalSupplierInfoHeaderTitle'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { GlobalSupplierInfoHeaderBooth } from './GlobalSupplierInfoHeaderBooth'

type Props = Readonly<{}>

export class GlobalSupplierInfoHeader extends React.PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <GlobalSupplierInfoHeaderTitle />
        <GlobalSupplierInfoHeaderBooth />
        <GlobalSupplierInfoHeaderAction />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingBottom: metrics.global_info_header_container_padding_bottom,
    borderBottomWidth: metrics.global_info_header_container_boder_bottom_width,
    borderBottomColor: colors.background_gray,
  },
})
