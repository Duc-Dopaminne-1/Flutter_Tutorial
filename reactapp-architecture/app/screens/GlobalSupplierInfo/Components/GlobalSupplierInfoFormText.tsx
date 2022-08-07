import * as React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { colors, fonts, metrics } from '@/vars'

type Props = {
  title?: string
  value?: string
}

export class GlobalSupplierInfoFormText extends React.PureComponent<Props> {
  renderValue = value => {
    return (
      <View style={styles.wrapValue}>
        <Text style={styles.textValue}>{value}</Text>
      </View>
    )
  }

  render() {
    const { title, value } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.wrapTitle}>
          <Text style={styles.textTitle}>{title}</Text>
        </View>
        {value !== '' ? this.renderValue(value) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    borderBottomWidth:
      metrics.global_info_detail_info_form_text_container_boder_bottom_with,
    borderBottomColor: colors.pale_grey,
  },
  wrapTitle: {
    paddingTop:
      metrics.global_info_detail_info_form_text_wrapitem_boder_padding_top,
    paddingBottom:
      metrics.global_info_detail_info_form_text_wrapitem_boder_padding_bottom,
  },
  textTitle: {
    color: colors.light_blue_grey,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapValue: {
    paddingBottom:
      metrics.global_info_detail_info_form_text_wrap_value_boder_padding_bottom,
  },
  textValue: {
    color: colors.black,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
