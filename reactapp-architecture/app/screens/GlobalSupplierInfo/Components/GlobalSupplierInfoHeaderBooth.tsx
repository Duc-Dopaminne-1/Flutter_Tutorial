import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import { GlobalSupplierInfoText } from './GlobalSupplierInfoText'
import I18n from '@/i18n'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { withContext } from '@/shared/withContext'
import { GlobalSupplierInfoContext } from '../GlobalSupplierInfoContext'

const defaultProps = {}

type DefaultProps = typeof defaultProps

type Props = Partial<{
  booth?: Booth
  saveSupplier?: () => void
}> &
  DefaultProps

@withContext(GlobalSupplierInfoContext.Consumer)
export class GlobalSupplierInfoHeaderBooth extends React.PureComponent<Props> {
  get nameBooth() {
    const { booth } = this.props
    const { boothName } = new SafeBooth(booth)

    if (boothName.length <= 0) return null

    return (
      <View style={styles.container}>
        <GlobalSupplierInfoText
          wrapTextStyle={styles.wrapTextBooth}
          textStyle={styles.textBooth}
          text={I18n.t('booth')}
        />
        <GlobalSupplierInfoText textStyle={styles.textName} text={boothName} />
      </View>
    )
  }

  onPress = () => {
    this.props.saveSupplier && this.props.saveSupplier()
  }

  render() {
    return (
      <View>
        {this.nameBooth}
        <GlobalSupplierInfoText
          wrapTextStyle={styles.wrapTextSave}
          textStyle={styles.textSave}
          text={I18n.t('saveThisSupplier')}
        />
        <TouchableOpacity style={styles.wrapButtonSave} onPress={this.onPress}>
          <Text style={styles.textButton}>{I18n.t('saveSupplier')}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:
      metrics.global_info_save_supplier_container_padding_Vertical,
    marginBottom: metrics.global_info_save_supplier_container_margin_bottom,
  },
  wrapTextBooth: {
    backgroundColor: colors.text_price,
    borderRadius: metrics.global_info_save_supplier_wraptextbooth_border_radius,
    paddingHorizontal:
      metrics.global_info_save_supplier_wraptextbooth_padding_horizontal,
    marginBottom: metrics.global_info_save_supplier_wraptextbooth_margin_bottom,
  },
  textBooth: {
    fontSize: fonts.size.xsn,
    color: colors.white,
    textAlign: 'center',
    fontFamily: fonts.family.SSPSemiBold,
  },
  textName: {
    fontSize: fonts.size.mxl,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapTextSave: {
    marginBottom: metrics.global_info_save_supplier_wrapTextSave_margin_bottom,
  },
  textSave: {
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButtonSave: {
    backgroundColor: colors.primary_blue,
    alignItems: 'center',
    paddingTop: metrics.global_info_save_supplier_wrapButtonSave_padding_top,
    paddingBottom:
      metrics.global_info_save_supplier_wrapButtonSave_padding_bottom,
    borderRadius: metrics.global_info_save_supplier_wrapButtonSave_boder_radius,
    marginBottom:
      metrics.global_info_save_supplier_wrapButtonSave_margin_bottom,
  },
  textButton: {
    color: colors.white,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
