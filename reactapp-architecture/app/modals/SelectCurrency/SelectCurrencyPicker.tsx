import { AModal4 } from '@/components/AModal/AModal4'
import { SelectCurrencyTab } from '@/modals/SelectCurrency/Components/SelectCurrencyTab'
import { Currency } from '@/models/constant'
import { Price, Product, Sample } from '@/models/team'
import {
  productNavigation,
  ProductRef,
  ProductRefAndroid,
} from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SafeProduct, SafeProductPrice } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { isNil } from 'ramda'
import React, { PureComponent } from 'react'
import { InteractionManager } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import {
  createProductNavigation,
  CreateProductRef,
  CreateProductRefAndroid,
} from '@/navigation/createProductNavigation'
import { mergeMap } from 'rxjs/operators'
import { modalStore } from '@/stores/modalStore'
import { SafeSample } from '@/shared/sample'
import {
  sampleNavigation,
  SampleRef,
  SampleRefAndroid,
} from '@/navigation/sampleNavigation'

export type Props = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      product: Product
      sample: Sample
      currency: string
      productIds?: string[]
      selectPriceMultiCurrency?: string
      selectPriceMulti?: (currency?: string) => void
      isCreateProduct?: boolean
      isCreateProductToSetRef?: boolean
      isProductToSetRef?: boolean
      isSampleToSetRef?: boolean
      getSample?: () => Sample
      isCustomField?: boolean
      indexOfField?: number
      indexOfFieldToUpDow?: number
      setValue?: (data, key, type?: string) => void
      isCurrency?: {
        isPrice?: boolean
        isSamplePrice?: boolean
        isMatrixPrice?: boolean
        indexMatrixPrice?: number
        currency?: string
      }
      priceMatrix?: any
      currencySamplePrice?: string
      hideUpDownClear?: boolean
    }>
  >

type State = {
  currencies: Realm.Collection<Currency>
  product: Product
  sample: Sample
  value: string
  price: SafeProductPrice
}

@withContext(AppContext.Consumer)
export class SelectCurrencyPicker extends PureComponent<Props, State> {
  _subscription: Subscription
  _results: Realm.Results<Currency> = [] as any
  _modal
  currency = 'USD'

  static readonly defaultProps = {}

  readonly state = {
    currencies: [] as any,
    product: null,
    sample: null,
    value: 'USD',
    price: null,
  }

  componentDidMount() {
    this.open()

    const { isCreateProduct, isCustomField } = this.safeDataNavigation

    if (isCreateProduct || isCustomField) {
      this.initDataCreateProduct()
    } else {
      this.initData()
    }

    this.fetchCurrency()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  get safeDataNavigation() {
    const { navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const isCreateProductToSetRef = navigation.getParam(
      'isCreateProductToSetRef',
      false
    )
    const productIds = this.props.navigation.getParam('productIds', [])
    const isProductToSetRef = navigation.getParam('isProductToSetRef', false)
    const isSampleToSetRef = navigation.getParam('isSampleToSetRef', false)
    const isCustomField = navigation.getParam('isCustomField', false)
    const product = navigation.getParam('product', null)
    let sample = navigation.getParam('sample', null)
    // Since the sample can be changed after opening SelectCurrencyPicker
    // We can cal getSample which will return the updated Sample
    const getSample = navigation.getParam('getSample', () => sample)
    sample = getSample()
    const isCurrency = navigation.getParam('isCurrency', null)
    const priceMatrix = navigation.getParam('priceMatrix', null)
    const currency = navigation.getParam('currency', '')
    const currencySamplePrice = navigation.getParam('currencySamplePrice', '')
    const indexOfField = navigation.getParam('indexOfField', 0)
    const setValue = navigation.getParam('setValue', null)
    const indexOfFieldToUpDow = this.props.navigation.getParam(
      'indexOfFieldToUpDow',
      10
    )
    return {
      productIds,
      isProductToSetRef,
      isSampleToSetRef,
      indexOfFieldToUpDow,
      isCreateProduct,
      isCreateProductToSetRef,
      isCustomField,
      product,
      sample,
      isCurrency,
      priceMatrix,
      currency,
      currencySamplePrice,
      indexOfField,
      setValue,
    }
  }

  initDataCreateProduct = () => {
    const {
      isCurrency,
      priceMatrix,
      currencySamplePrice,
      currency,
    } = this.safeDataNavigation
    const isMatrixPrice = isCurrency && isCurrency.isMatrixPrice
    const isSamplePrice = isCurrency && isCurrency.isSamplePrice

    if (isMatrixPrice) {
      this.setState({
        value: priceMatrix.rows[isCurrency.indexMatrixPrice].price.currency,
      })
      modalStore.selectCurrency =
        priceMatrix.rows[isCurrency.indexMatrixPrice].price.currency
    } else if (isSamplePrice) {
      this.setState({
        value: isCurrency.currency ? isCurrency.currency : currencySamplePrice,
      })
      modalStore.selectCurrency = isCurrency.currency
        ? isCurrency.currency
        : currencySamplePrice
    } else {
      this.setState({
        value:
          isCurrency && isCurrency.currency ? isCurrency.currency : currency,
      })
      modalStore.selectCurrency =
        isCurrency && isCurrency.currency ? isCurrency.currency : currency
    }
  }

  initData = () => {
    const {
      product,
      isCurrency,
      sample,
      isSampleToSetRef,
    } = this.safeDataNavigation
    const safeProduct = new SafeProduct(product)
    const safeSample = new SafeSample(sample)
    const isMatrixPrice = isCurrency && isCurrency.isMatrixPrice
    const isSamplePrice = isCurrency && isCurrency.isSamplePrice

    const price = isSampleToSetRef ? safeSample.price : safeProduct.price
    this.setState({
      product,
      sample,
      price,
    })

    if (isSampleToSetRef) {
      this.setState({
        value: safeSample.currency.currency,
      })
      modalStore.selectCurrency = safeSample.currency.currency
      return
    }

    if (isMatrixPrice) {
      this.setState({
        value: safeProduct.currencyPriceMatrix[isCurrency.indexMatrixPrice],
      })
      modalStore.selectCurrency =
        safeProduct.currencyPriceMatrix[isCurrency.indexMatrixPrice]
      return
    }
    if (isSamplePrice) {
      this.setState({
        value: safeProduct.currencySamplePrice.currency,
      })
      modalStore.selectCurrency = safeProduct.currencySamplePrice.currency
      return
    }

    this.setState({
      value: safeProduct.price.currency,
    })
    modalStore.selectCurrency = safeProduct.price.currency
  }

  fetchCurrency = () => {
    const { currencyFactory } = this.props
    const [subscription, results] = currencyFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(currencies => {
      this.setState(
        {
          currencies,
        },
        () => {
          this.forceUpdate()
        }
      )
    })
  }

  onPress = () => {
    const {
      isCurrency,
      isCreateProduct,
      isSampleToSetRef,
      priceMatrix,
      isCustomField,
      indexOfField,
      setValue,
      currency,
    } = this.safeDataNavigation

    this.close(true)

    const selectPriceMulti = this.props.navigation.getParam(
      'selectPriceMulti',
      null
    )
    if (selectPriceMulti) {
      const hideUpDownClear = this.props.navigation.getParam(
        'hideUpDownClear',
        false
      )
      const selectPriceMultiCurrency = this.props.navigation.getParam(
        'selectPriceMultiCurrency',
        null
      )
      this.props.navigation.navigate('SelectCurrencyPickerList', {
        selectPriceMulti,
        selectPriceMultiCurrency,
        isSample: isSampleToSetRef,
        hideActionBar: !!hideUpDownClear,
      })
      return
    }

    InteractionManager.runAfterInteractions(() => {
      if (isSampleToSetRef) {
        if (isCustomField) {
          const customField = {
            setValue,
            currency,
            indexOfField,
            isCustomField: true,
            movePickerList: true,
            indexOfFieldToUpDow: 0,
          }
          sampleNavigation.onMoveUpDow(
            SampleRef.SelectCurrency,
            null,
            customField
          )
        } else {
          sampleNavigation.open(
            SampleRefAndroid.SelectCurrencyPickerList,
            isCurrency
          )
        }
        return
      }
      if (isCustomField) {
        const customField = {
          setValue,
          currency,
          indexOfField,
          isCustomField: true,
          movePickerList: true,
          indexOfFieldToUpDow: 0,
        }
        productNavigation.onMoveUpDow(
          ProductRef.SelectCurrency,
          null,
          customField
        )
      } else if (isCreateProduct) {
        createProductNavigation.open(
          CreateProductRefAndroid.SelectCurrencyPickerList,
          isCurrency,
          priceMatrix
        )
      } else {
        productNavigation.open(
          ProductRefAndroid.SelectCurrencyPickerList,
          isCurrency
        )
      }
    })
  }

  onSelect = (currency: Currency) => {
    const {
      isCreateProduct,
      isSampleToSetRef,
      isCustomField,
      indexOfField,
      setValue,
    } = this.safeDataNavigation

    this.currency = currency.symbol

    modalStore.setCurrency({
      id: currency.symbol,
      name: '',
      symbol: currency.symbol,
    })

    modalStore.selectCurrency = currency.symbol

    this.setState({ value: currency.symbol })

    if (isCreateProduct && setValue) {
      this.onSelectCurrencyInCreateProduct(currency)
      return
    }
    if (isCustomField && setValue) {
      setValue(currency.symbol, indexOfField)
      return
    }

    this.updateToRealm(currency)
  }

  onSelectCurrencyInCreateProduct = (currency: Currency) => {
    const { setValue, isCurrency, priceMatrix } = this.safeDataNavigation
    const isMatrixPrice = isCurrency && isCurrency.isMatrixPrice
    const isSamplePrice = isCurrency && isCurrency.isSamplePrice

    if (isMatrixPrice) {
      const { indexMatrixPrice } = isCurrency
      const newPriceMatrixRows = [...priceMatrix.rows]

      priceMatrix.rows[indexMatrixPrice].price = {
        currency: currency.symbol,
        value: priceMatrix.rows[indexMatrixPrice].price.value,
      }

      newPriceMatrixRows[indexMatrixPrice]['price'] =
        priceMatrix.rows[indexMatrixPrice].price

      setValue(newPriceMatrixRows, 'rows', 'priceMatrix')

      return
    }
    if (isSamplePrice) {
      setValue(currency.symbol, 'currencySamplePrice')
      return
    }

    setValue(currency.symbol, 'currency')
  }

  updateToRealm = (currency: Currency) => {
    const {
      product,
      isCurrency,
      sample,
      isSampleToSetRef,
    } = this.safeDataNavigation
    const { samplePrice, price } = new SafeProduct(product)
    const isMatrixPrice = isCurrency && isCurrency.isMatrixPrice
    const isSamplePrice = isCurrency && isCurrency.isSamplePrice

    if (isSampleToSetRef) {
      if (!sample && !isNil(price)) return null
      this.updatePrice('price', currency.symbol, price)
      return
    }

    if (!product && !isNil(price)) return null

    if (isSamplePrice) {
      this.updatePrice('samplePrice', currency.symbol, samplePrice)
      return
    }
    if (isMatrixPrice) {
      this.updateCurrencyPriceMatrix(
        currency.symbol,
        isCurrency.indexMatrixPrice
      )
      return
    }

    this.updatePrice('price', currency.symbol, price)
  }

  updatePrice = (key: string, currency: string, data: Price) => {
    const { productFactory, sampleFactory } = this.props
    const { product, sample, isSampleToSetRef } = this.safeDataNavigation

    if (isSampleToSetRef) {
      if (!sample && !sample.id) return

      sampleFactory
        .update(sample.id, {
          [key]: {
            ...sample[key],
            currency,
            id: data.id,
          },
        })
        .subscribe(() => {})
      return
    }
    if (!product && !product.id) return

    productFactory
      .update(product.id, {
        [key]: {
          currency,
          id: data.id,
        },
      })
      .subscribe(() => {})
  }

  updateCurrencyPriceMatrix = (value: string, indexMatrixPrice: number) => {
    const { product } = this.state
    const { priceMatrixFactory, priceMatrixRowFactory } = this.props
    const { priceMatrix } = new SafeProduct(product)

    if (priceMatrix.rows.length > 0) {
      const priceMatrixRow = priceMatrix.rows[indexMatrixPrice]
      const data = {
        id: priceMatrixRow.price.id,
        currency: value,
      }

      priceMatrixRowFactory
        .update(priceMatrix.rows[indexMatrixPrice].id, { price: data })
        .subscribe(() => {})
    } else {
      if (priceMatrix.rows && priceMatrix.rows[0] && priceMatrix.rows[0].id) {
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
          .subscribe(() => {})
      }
    }
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = (isOpenListCurrency: boolean = false) => {
    !isOpenListCurrency && modalStore.cleanAllSelectData()
    if (this._modal) {
      const productIds = this.props.navigation.getParam('productIds', [])
      if (productIds.length > 0 && !isOpenListCurrency) {
        this.selectPriceMultiCb()
      }
      this._modal.close()
    }
  }

  selectPriceMultiCb = () => {
    const selectPriceMulti = this.props.navigation.getParam(
      'selectPriceMulti',
      null
    )
    if (selectPriceMulti) {
      selectPriceMulti(this.currency)
    }
  }

  onComplete = () => {
    this.close()
  }

  setModalRef = nodeRef => {
    const {
      isCurrency,
      isCustomField,
      isCreateProductToSetRef,
      indexOfFieldToUpDow,
      isProductToSetRef,
      isSampleToSetRef,
    } = this.safeDataNavigation
    const isMatrixPrice = isCurrency && isCurrency.isMatrixPrice
    const isSamplePrice = isCurrency && isCurrency.isSamplePrice

    this._modal = nodeRef
    if (isMatrixPrice) {
      productNavigation.setPriceMatrixRef(
        isCurrency.indexMatrixPrice * 3 + 3,
        nodeRef
      )
      createProductNavigation.setPriceMatrixRef(
        isCurrency.indexMatrixPrice * 3 + 3,
        nodeRef
      )
    } else if (isSamplePrice) {
      productNavigation.setRef(ProductRef.CurrencySamplePrice, nodeRef)
      createProductNavigation.setRef(
        CreateProductRef.CurrencySamplePrice,
        nodeRef
      )
    } else if (isCustomField) {
      if (isCreateProductToSetRef) {
        createProductNavigation.setCustomFieldRef(indexOfFieldToUpDow, nodeRef)
      }
      if (isProductToSetRef) {
        productNavigation.setCustomFieldRef(indexOfFieldToUpDow, nodeRef)
      }
      if (isSampleToSetRef) {
        sampleNavigation.setCustomFieldRef(indexOfFieldToUpDow, nodeRef)
      }
    } else {
      productNavigation.setRef(ProductRef.SelectCurrency, nodeRef)
      createProductNavigation.setRef(CreateProductRef.SelectCurrency, nodeRef)
      sampleNavigation.setRef(SampleRef.SelectCurrency, nodeRef)
    }
  }

  render() {
    const hideUpDownClear = this.props.navigation.getParam(
      'hideUpDownClear',
      false
    )

    return (
      <AModal4
        ref={this.setModalRef}
        onComplete={this.onComplete}
        onClear={() => {
          this.onSelect({ symbol: 'USD' } as Currency)
        }}
        hideUpDownClear={hideUpDownClear}
        selectPriceShowModal={this.selectPriceMultiCb}
      >
        <SelectCurrencyTab
          value={this.state.value}
          onPress={this.onPress}
          onSelect={this.onSelect}
        />
      </AModal4>
    )
  }
}
