import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { colors, fonts, metrics } from '@/vars'

type ADataRowItemProps = Readonly<{
  name: string
}>

export const ADataRowItem: React.SFC<ADataRowItemProps> = ({ name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name.toUpperCase()}</Text>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    marginRight: metrics.small_base,
    borderColor: colors.border_gray,
    borderWidth: metrics.adata_row_item_container_border_width,
    borderRadius: metrics.adata_row_item_container_border_radius,
    paddingHorizontal: metrics.adata_row_item_container_padding_horizontal,
    paddingVertical: metrics.data_row_item_container_padding_vertical,
  },
  text: {
    color: colors.text_grey,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPBold,
  },
})
