import { AForm } from '@/components/AForm/AForm'
import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { ProductInfoTrading } from './ProductInfoTrading'
import { productNavigation, ProductData } from '@/navigation/productNavigation'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps

export type State = Readonly<typeof initialState>

export class ProductInfoTradeShipping extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  render() {
    productNavigation.setData(ProductData.isShippingRender, true)
    return (
      <View style={styles.container}>
        <AForm
          title={I18n.t('tradeShipping')}
          titleContainer={styles.titleContainer}
          textLabelStyle={styles.textLabel}
        >
          <ProductInfoTrading />
        </AForm>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  form: {
    marginTop: 0,
  },
  titleContainer: {
    paddingTop: metrics.triple_base,
    borderBottomWidth: 0,
  },
  textLabel: {
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
  },
})
