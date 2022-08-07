import { AChipStatus } from '@/components/AChip/AChipStatus'
import I18n from '@/i18n'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

type Props = {
  safeProduct?: SafeProduct
}

@withContext(ProductInfoContext.Consumer)
export class ProductInfoHeaderStatus extends React.PureComponent<Props> {
  render() {
    const { safeStatus } = this.props.safeProduct

    return (
      <View style={styles.container}>
        <View style={styles.wrapProduct}>
          <Image source={images.product} style={styles.icon} />

          <Text style={styles.text}>{I18n.t('product')}</Text>
        </View>

        <AChipStatus
          // @ts-ignore
          status={safeStatus}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.medium_base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapProduct: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 12,
    tintColor: colors.blue_light_grey,
    marginRight: metrics.small_base,
  },
  text: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
})
