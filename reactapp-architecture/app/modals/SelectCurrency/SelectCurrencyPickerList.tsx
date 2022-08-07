import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Currency } from '@/models/constant'
import { Product, Sample } from '@/models/team'
import {
  productNavigation,
  ProductRefAndroid,
} from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { SafeProduct, SafeProductPrice } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { isNil } from 'ramda'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { SelectCurrencyList } from './Components/SelectCurrencyList'
import {
  createProductNavigation,
  CreateProductRefAndroid,
} from '@/navigation/createProductNavigation'
import dataCurrencies from '@/i18n/currencies/en'
import { mergeMap, sample } from 'rxjs/operators'
import { modalStore } from '@/stores/modalStore'
import { SafeSample } from '@/shared/sample'
import {
  sampleNavigation,
  SampleRef,
  SampleRefAndroid,
} from '@/navigation/sampleNavigation'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      product: Product
      sample: Sample
      isSample?: boolean
      currency: string
      selectPriceMulti?: (currency?: string) => void
      isCreateProduct?: boolean
      isCustomField?: boolean
      selectPriceMultiCurrency?: string
      indexOfField?: number
      setValue?: (data, key, type?: string) => void
      isCurrency?: {
        isPrice: boolean
        isSamplePrice: boolean
        isMatrixPrice: boolean
        indexMatrixPrice: number
      }
      priceMatrix?: any
      hideActionBar?: boolean
    }>
  >

export type State = Readonly<{
  currencies: []
  product: SafeProduct
  sample: SafeSample
  keyword: string
  loading: boolean
  price: SafeProductPrice
  value: string
  renderKey: number
}>

@withContext(AppContext.Consumer)
export class SelectCurrencyPickerList extends React.PureComponent<
  Props,
  State
> {
  _fuse: FuseService<Currency> = new FuseService<Currency>([] as any)
  _subscription: Subscription
  _modal
  currency = 'USD'

  static readonly defaultProps = defaultProps

  readonly state: State = {
    keyword: '',
    currencies: dataCurrencies as any,
    loading: true,
    product: null,
    sample: null,
    price: null,
    value: 'USD',
    renderKey: 0,
  }

  componentDidMount() {
    this.open()
    this.initDataCreateProduct()
    this.initData()
    this._fuse = new FuseService<Currency>(dataCurrencies as any)
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const isCustomField = navigation.getParam('isCustomField', false)
    const indexOfField = navigation && navigation.getParam('indexOfField', 0)
    const setValue = navigation && navigation.getParam('setValue', null)
    const isCurrency = navigation.getParam('isCurrency', null)
    const priceMatrix = navigation.getParam('priceMatrix', null)
    const product = navigation && navigation.getParam('product', null)
    const sample = navigation && navigation.getParam('sample', null)
    const isSample = navigation.getParam('isSample', false)

    return {
      isCreateProduct,
      isCustomField,
      indexOfField,
      setValue,
      isCurrency,
      priceMatrix,
      product,
      sample,
      isSample,
    }
  }

  initData = () => {
    const { product, sample } = this.navigationData()
    const safeProduct = new SafeProduct(product)
    const safeSample = new SafeSample(sample)

    this.setState({
      product: safeProduct,
      sample: safeSample,
    })

    this.initDataNormalPrice()
    this.initDataMatrixPrice()
    this.initDataSamplePrice()
  }

  initDataNormalPrice = () => {
    const { product, isCurrency, sample, isSample } = this.navigationData()
    const { price: priceProduct } = new SafeProduct(product)
    const { price: priceSample } = new SafeSample(sample)

    if (!isCurrency || !isCurrency.isPrice) return

    const price = isSample ? priceSample : priceProduct
    this.setState({
      price,
      value: price.currency,
    })
  }

  initDataMatrixPrice = () => {
    const { product, isCurrency, isSample } = this.navigationData()
    const { priceMatrix } = new SafeProduct(product)

    if (
      isSample ||
      !isCurrency ||
      !isCurrency.isMatrixPrice ||
      priceMatrix.rows.length <= 0
    ) {
      return
    }

    const index = isCurrency.indexMatrixPrice

    this.setState({
      price: priceMatrix,
      value: priceMatrix.rows[index].price.currency,
    })
  }

  initDataSamplePrice = () => {
    const { product, isCurrency, isSample } = this.navigationData()
    const { samplePrice } = new SafeProduct(product)

    if (isSample || !isCurrency || !isCurrency.isSamplePrice) return

    this.setState({
      price: samplePrice,
      value: samplePrice.currency,
    })
  }

  initDataCreateProduct = () => {
    const { isCreateProduct, isCustomField } = this.navigationData()

    if (!isCreateProduct && !isCustomField) return

    this.setState({
      value: '',
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        currencies: dataCurrencies as any,
      })
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (currency: Currency) => {
    const {
      isCreateProduct,
      isCustomField,
      indexOfField,
      setValue,
      isCurrency,
      priceMatrix,
      isSample,
    } = this.navigationData()

    this.currency = currency.symbol
    const selectPriceMulti = this.props.navigation.getParam(
      'selectPriceMulti',
      null
    )
    if (selectPriceMulti) {
      this.close()
      return
    }

    // Add to suggest
    modalStore.setCurrency(currency)

    if (isCreateProduct && setValue) {
      if (isCurrency && isCurrency.isPrice) {
        setValue(currency.symbol, 'currency')
      } else if (isCurrency && isCurrency.isMatrixPrice) {
        priceMatrix.rows[isCurrency.indexMatrixPrice].price = {
          currency: currency.symbol,
          value: priceMatrix.rows[isCurrency.indexMatrixPrice].price.value,
        }
        const newPriceMatrixRows = [...priceMatrix.rows]
        newPriceMatrixRows[isCurrency.indexMatrixPrice]['price'] =
          priceMatrix.rows[isCurrency.indexMatrixPrice].price
        setValue(newPriceMatrixRows, 'rows', 'priceMatrix')
      } else if (isCurrency && isCurrency.isSamplePrice) {
        setValue(currency.symbol, 'currencySamplePrice')
      }
      this.close()
    } else if (isCustomField && setValue) {
      setValue(currency.symbol, indexOfField)
      this.close()
    } else {
      this.updateToRealm(currency)
    }
    this.setState({ value: currency.symbol })
  }

  updateToRealm = (currency: Currency) => {
    const { product, price, sample } = this.state
    const { samplePrice } = product
    const { isCurrency, isSample } = this.navigationData()

    if (isSample) {
      if (!price || price.currency === currency.symbol) {
        this.close()
        return
      }

      if (isCurrency && isCurrency.isPrice) {
        this.props.sampleFactory
          .update(sample.id, {
            price: {
              currency: currency.symbol,
              id: price.id,
              value: price.value,
            },
          })
          .subscribe(
            () => {
              this.close()
            },
            () => {
              this.close()
            }
          )
      }
      return
    }

    if (!product && !isNil(price)) return null

    if (!price || price.currency === currency.symbol) return

    if (isCurrency && isCurrency.isPrice) {
      this.props.productFactory
        .update(product.id, {
          price: {
            currency: currency.symbol,
            id: price.id,
            value: price.value,
          },
        })
        .subscribe(() => {
          this.close()
        })
    } else if (isCurrency && isCurrency.isSamplePrice) {
      this.props.productFactory
        .update(product.id, {
          samplePrice: {
            id: samplePrice.id,
            currency: currency.symbol,
          },
        })
        .subscribe(() => {
          this.close()
        })
    } else if (isCurrency && isCurrency.isMatrixPrice) {
      this.updateCurrencyPriceMatrix(
        currency.symbol,
        isCurrency.indexMatrixPrice
      )
    }
  }

  updateCurrencyPriceMatrix = (value: string, indexMatrixPrice: number) => {
    const { product } = this.navigationData()
    const { priceMatrix } = new SafeProduct(product)
    const { priceMatrixFactory, priceMatrixRowFactory } = this.props

    if (priceMatrix.rows.length > 0) {
      const priceMatrixRow = priceMatrix.rows[indexMatrixPrice]
      const data = {
        id: priceMatrixRow.price.id,
        currency: value,
      }

      priceMatrixRowFactory
        .update(priceMatrix.rows[indexMatrixPrice].id, { price: data })
        .subscribe(() => {
          this.close()
        })
    } else if (
      priceMatrix.rows &&
      priceMatrix.rows[0] &&
      priceMatrix.rows[0].id
    ) {
      priceMatrixFactory
        .createAndUpdateProduct(product.id)
        .pipe(
          mergeMap(priceMatrix => {
            const data = {
              id: priceMatrix.rows[0].price.id,
              currency: value,
            }

            return priceMatrixRowFactory.update(priceMatrix.rows[0].id, {
              price: data,
            })
          })
        )
        .subscribe(() => {
          this.close()
        })
    }
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      currencies: result.data as any,
    })
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    if (this._modal) {
      modalStore.cleanAllSelectData()
      this.selectPriceMultiCb()
      this._modal.close()
    }
  }

  selectPriceMultiCb = (currency = '') => {
    const selectPriceMulti = this.props.navigation.getParam(
      'selectPriceMulti',
      null
    )
    if (selectPriceMulti) {
      const currencyShow = currency !== '' ? currency : this.currency
      selectPriceMulti(currencyShow)
    }
  }

  onClear = () => {
    this.onChangeText('')
    this.setState({
      renderKey: this.state.renderKey + 1,
    })
  }

  onComplete = () => {
    this.close()
  }

  setModalRef = nodeRef => {
    this._modal = nodeRef
    productNavigation.setRef(
      ProductRefAndroid.SelectCurrencyPickerList,
      nodeRef
    )
    createProductNavigation.setRef(
      CreateProductRefAndroid.SelectCurrencyPickerList,
      nodeRef
    )
    sampleNavigation.setRef(SampleRefAndroid.SelectCurrencyPickerList, nodeRef)
  }

  render() {
    const { keyword, currencies, renderKey } = this.state
    const hideActionBar = this.props.navigation.getParam('hideActionBar', false)
    const selectPriceMultiCurrency = this.props.navigation.getParam(
      'selectPriceMultiCurrency',
      null
    )
    return (
      <AModal3
        ref={this.setModalRef}
        headerProps={{
          title: I18n.t('selectCurrency'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterCurrency'),
        }}
        onClear={this.onClear}
        renderKey={renderKey}
        hideActionBar={hideActionBar}
        selectPriceMultiCurrency={selectPriceMultiCurrency}
        selectPriceShowModal={this.selectPriceMultiCb}
      >
        <SelectCurrencyList
          onPress={this.onSelect}
          data={currencies as any}
          keyword={keyword.trim()}
        />
      </AModal3>
    )
  }
}
