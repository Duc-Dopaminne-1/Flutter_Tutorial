import { Tag } from '@/models/team'
import { GlobalSupplierInfoContext } from '../GlobalSupplierInfoContext'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { ADataRow } from '@/components/ADataRow/ADataRow'
import { ADataTextGlobal } from '@/components/ADataTextGlobal/ADataTextGlobal'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { SafeSupplier } from '@/shared/supplier'
import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { GlobalSupplierInfoForm } from './GlobalSupplierInfoForm'

type Props = Partial<{
  booth: Booth
}>

export type State = Readonly<{}>

@withContext(GlobalSupplierInfoContext.Consumer)
export class GlobalSupplierInfoDetail extends React.PureComponent<
  Props,
  State
> {
  render() {
    const { booth } = this.props
    const { supplier } = new SafeBooth(booth)
    const { safeTags } = new SafeSupplier(supplier)

    return (
      <View style={styles.container}>
        <ADataTextGlobal />

        <ADataRow<Tag>
          isGlobal={true}
          containerStyle={styles.wrapItem}
          data={safeTags}
        />

        <View style={styles.warpForm}>
          <ATitle title={I18n.t('supplierDetails')} />
          <GlobalSupplierInfoForm />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingBottom: metrics.global_info_detail_container_padding_bottom,
  },
  wrapItem: {
    paddingTop: 0,
    paddingVertical: metrics.keylines_screen_edge_margin,
  },
  warpForm: {
    backgroundColor: colors.white,
    paddingTop: metrics.keylines_screen_edge_margin,
  },
})
