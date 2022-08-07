import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AModal4 } from '@/components/AModal/AModal4'
import { APicker } from '@/components/APicker/APicker'
import { Currency } from '@/models/constant'
import { Product } from '@/models/team'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SafeProduct, SafeProductPrice } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { isNil } from 'ramda'
import React, { PureComponent } from 'react'
import { Picker } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'

export type Props = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      product: Product
      currency: string
      isCreateProduct?: boolean
      setValue?: (data, key) => void
    }>
  >

type State = {
  currencies: Realm.Collection<Currency>
  loading: boolean
  product: Product
  value: string
  price: SafeProductPrice
}

@withContext(AppContext.Consumer)
export class SelectCurrencyPicker extends PureComponent<Props, State> {
  _subscription: Subscription
  _results: Realm.Results<Currency>
  _modal

  static readonly defaultProps = {}

  readonly state = {
    currencies: [] as any,
    loading: true,
    product: null,
    value: 'USD',
    price: null,
  }

  componentDidMount() {
    this.open()

    const { currencyFactory, navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const product = navigation.getParam('product', null)
    const currency = navigation.getParam('currency', '')

    if (isCreateProduct) {
      this.setState({
        value: currency,
      })
    } else {
      const safeProduct = new SafeProduct(product)
      this.setState({
        product,
        price: safeProduct.price,
        value: safeProduct.price.currency,
      })
    }

    const [subscription, results] = currencyFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(currencies => {
      this.setState(
        {
          currencies,
          loading: false,
        },
        () => {
          this.forceUpdate()
        }
      )
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  onValueChange = (value: string) => {
    const { navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    if (isCreateProduct && setValue) {
      setValue(value, 'currency')
    } else {
      this.updateToRealm(value)
    }

    this.setState({ value })
  }

  updateToRealm = (value: string) => {
    const product = this.props.navigation.getParam('product', null)
    const { samplePrice, price } = new SafeProduct(product)

    if (!product && !isNil(price)) return null

    this.props.productFactory
      .update(product.id, {
        price: {
          currency: value,
          id: price.id,
          value: price.value,
        },
        samplePrice: {
          id: samplePrice.id,
          currency: value,
        },
      })
      .subscribe(() => {
        this.updateCurrencyPriceMatrix(value)
      })
  }

  // @ts-ignore
  updateCurrencyPriceMatrix = (value: string) => {
    const { product } = this.state
    if (product.priceMatrix && product.priceMatrix.rows) {
      const { rows } = product.priceMatrix
      // this.props.priceMatrixFactory
      //   .updateCurrency(rows, value)
      //   .subscribe(() => {})
    }
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
    }
  }

  onComplete = () => {
    this.close()
  }

  onClear = () => {
    this.onValueChange('USD')
  }

  render() {
    const { value, currencies, loading } = this.state

    return (
      <AModal4
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectCurrency, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.SelectCurrency,
            nodeRef
          )
        }}
        onComplete={this.onComplete}
        onClear={this.onClear}
      >
        {loading ? (
          <AIndicator full />
        ) : (
          <APicker<Currency>
            data={currencies}
            value={value}
            onValueChange={this.onValueChange}
            renderItem={() => {
              return currencies.map(value => (
                <Picker.Item key={value.id} label={value.id} value={value.id} />
              ))
            }}
          />
        )}
      </AModal4>
    )
  }
}
