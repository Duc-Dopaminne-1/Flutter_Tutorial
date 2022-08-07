import { colors, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'
import { Supplier } from '@/models/team'
import { ALabel } from '@/components/ALabel/ALabel'
import I18n from '@/i18n'
import { AChipStatus } from '@/components/AChip/AChipStatus'

type SupplierInfoHeaderStatusProps = Readonly<{
  supplier?: Supplier
  safeSupplier?: SafeSupplier
}>

@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoHeaderStatus extends React.PureComponent<
  SupplierInfoHeaderStatusProps
> {
  renderLabel = () => {
    const { safeStatus } = this.props.safeSupplier
    const { supplier } = this.props

    return (
      <AChipStatus
        // @ts-ignore
        status={safeStatus}
        supplier={supplier}
        fromSupplier={true}
      />
    )
  }

  render() {
    return <View style={styles.container}>{this.renderLabel()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    height: 30,
    paddingTop: metrics.small_base,
    marginTop: 8,
    alignItems: 'flex-end',
  },
})
