import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { getCurrencySymbol } from '@/shared/format'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import validate from 'validate.js'
import { Subscription } from 'rxjs'
import { updateProductInfo } from '@/services/global'

// init state
const initialState = {
  isEdit: false,
  samplePrice: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
  safeProduct?: SafeProduct
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    [key: string]: any
  }>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
export class ProductInfoSamplePrice extends React.PureComponent<Props, State> {
  _subscriptionUpdateProductInfo: Subscription

  readonly state: State = initialState

  componentDidMount() {
    this.init()
    this.updateProductInfo()
  }

  componentWillUnmount() {
    this._subscriptionUpdateProductInfo &&
      this._subscriptionUpdateProductInfo.unsubscribe()
  }

  init = () => {
    const { samplePrice } = this.props.safeProduct

    this.setState({
      samplePrice:
        samplePrice.value !== 0 ? (samplePrice.value / 10000).toString() : '',
    })
  }

  updateProductInfo = () => {
    this._subscriptionUpdateProductInfo = updateProductInfo.subscribe(
      product => {
        if (!product) return

        const { samplePrice } = new SafeProduct(product)

        this.setState({
          samplePrice:
            samplePrice.value !== 0
              ? (samplePrice.value / 10000).toString()
              : '',
        })
      }
    )
  }

  onChangeText = (text: string) => {
    this.setState({
      samplePrice: text,
      isEdit: true,
    })
  }

  checkValue = key => {
    const value = this.state[key].toString()

    if (!value || value.length === 0) {
      return 0
    }

    const number = Number(value.replace(',', '.'))
    if (!validate.isNumber(number)) {
      alert(I18n.t('notANumber'))
      return null
    }

    // set convertToNumber value to state
    this.setState({
      [key]: number,
    })

    return number
  }

  onSubmit = () => {
    const { productFactory, safeProduct, product } = this.props
    const { samplePrice } = safeProduct

    const value = this.checkValue('samplePrice')
    if (value === null || value === undefined) {
      this.setState({
        samplePrice: '',
      })

      return
    }

    const createPriceSample = {
      id: samplePrice.id,
      value: value * 10000,
      currency: samplePrice.currency,
    }

    productFactory
      .update(product.id, {
        samplePrice: createPriceSample,
      })
      .subscribe(() => {}, () => {})
  }

  onFocusTextInput = () => {
    productNavigation.current = ProductRef.SamplePrice
    productNavigation.currentPriceMatrix =
      productNavigation.PriceMatrixRefTotal +
      (ProductRef.SamplePrice - ProductRef.PriceMatrix)
  }

  data = () => {
    const { isEdit } = this.state
    const { safeProduct } = this.props
    const { samplePrice, currencySamplePrice } = safeProduct

    const symbolCurrency =
      getCurrencySymbol(currencySamplePrice.currency) ||
      currencySamplePrice.currency

    const convertSamplePrice = samplePrice.value
      ? (samplePrice.value / 10000).toString()
      : ''

    return {
      symbolCurrency,
      currency: samplePrice.currency,
      samplePrice: isEdit ? this.state.samplePrice : convertSamplePrice,
    }
  }

  renderCurrencyTitle = (currency: string) => {
    const isCurrency = {
      isSamplePrice: true,
    }

    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            productNavigation.current = ProductRef.CurrencySamplePrice
            productNavigation.currentPriceMatrix =
              productNavigation.PriceMatrixRefTotal +
              (ProductRef.CurrencySamplePrice - ProductRef.PriceMatrix)
            productNavigation.open(ProductRef.CurrencySamplePrice, isCurrency)
          }}
        >
          <Text style={styles.money}>{currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { samplePrice, symbolCurrency, currency } = this.data()

    return (
      <View style={styles.wrapSamplePrice}>
        <AInput
          ref={nodeRef => {
            productNavigation.setRef(ProductRef.SamplePrice, nodeRef)
          }}
          value={samplePrice}
          inputStyle={styles.inputPrice}
          title={I18n.t('samplePrice').toUpperCase()}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText}
          onEndEditing={this.onSubmit}
          customRightIcon={this.renderCurrencyTitle(currency)}
          onFocusTextInput={this.onFocusTextInput}
          textFieldProps={{
            prefix: symbolCurrency,
            affixTextStyle: {
              color: colors.dark_blue_grey,
            },
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapSamplePrice: {
    marginTop: metrics.double_base,
  },
  input: {
    marginRight: 3,
  },
  wrapButton: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
  wrapMoney: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.base,
    paddingVertical: metrics.small_base,
    marginRight: metrics.base,
  },
  money: {
    fontSize: fonts.size.m,
    fontWeight: '600',
    color: colors.blue_light_grey,
  },
  inputPrice: {
    marginRight: 60,
  },
})
