import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProductInfoTradingPriceMatrix } from '@/screens/ProductInfo/Components/ProductInfoTradingPriceMatrix'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductInfoTradingInnerCarton } from '@/screens/ProductInfo/Components/ProductInfoTradingInnerCarton'
import { ProductInfoTradingMasterCarton } from '@/screens/ProductInfo/Components/ProductInfoTradingMasterCarton'
import { ProductInfoSamplePrice } from '@/screens/ProductInfo/Components/ProductInfoSamplePrice'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
export class ProductInfoTrading extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { product } = this.props

    return (
      <View style={styles.container}>
        {/* Inner Packaging */}
        <ProductInfoTradingInnerCarton />

        {/* Master Carton */}
        <ProductInfoTradingMasterCarton />

        {/* Price Matrix */}
        <ProductInfoTradingPriceMatrix product={product} />

        {/* Sample Price */}
        <ProductInfoSamplePrice />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: metrics.keylines_screen_product_info_margin,
    paddingBottom: 61,
  },
})
