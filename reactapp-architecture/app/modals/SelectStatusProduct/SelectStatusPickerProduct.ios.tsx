import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AModal4 } from '@/components/AModal/AModal4'
import { APicker } from '@/components/APicker/APicker'
import I18n from '@/i18n'
import { Product, ProductStatus } from '@/models/team'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { pathOr } from 'ramda'
import React, { PureComponent } from 'react'
import { Picker } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SafeStatusType } from '@/shared/statusType'
import { debounce } from 'lodash'
import { Toast } from '@/services/global'

export type SelectStatusPickerProps = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      productsId: string[]
      isCreateProduct?: boolean
      setValue?: (data, key) => void
      status: ProductStatus
      product: Product
      hideActionBar?: boolean
      hideUpDownClear?: boolean
    }>
  >

type SelectStatusPickerState = {
  status: Realm.Collection<ProductStatus>
  errMsg: string
  product: SafeProduct
  value: string
  loading: boolean
}

@withContext(AppContext.Consumer)
export class SelectStatusPickerProduct extends PureComponent<
  SelectStatusPickerProps,
  SelectStatusPickerState
> {
  _subscription: Subscription
  _results: Realm.Results<ProductStatus> = [] as any
  _modal
  _isChoose = false
  _modalIsClose = true

  static readonly defaultProps = {}

  readonly state: SelectStatusPickerState = {
    status: [] as any,
    product: null,
    value: '',
    errMsg: '',
    loading: true,
  }

  componentDidMount() {
    this.open()

    const { productStatusFactory, navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const status = navigation.getParam('status', null)
    const product = navigation.getParam('product', null)

    if (isCreateProduct) {
      this.setState({
        value: pathOr('', ['id'], status),
      })
    } else {
      const safeProduct = new SafeProduct(product)

      this.setState({
        value: safeProduct.safeStatus.id,
        product: safeProduct,
      })
    }

    const [subscription, results] = productStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(productStatus => {
      this.setState(
        {
          status: productStatus,
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
    const { productStatusFactory, navigation } = this.props

    if (value === this.state.value) {
      return
    }

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    const selectedStatus = productStatusFactory.getDatFromId(
      this._results || ([] as any),
      value
    )

    if (!selectedStatus) {
      return
    }
    if (isCreateProduct && setValue) {
      setValue(selectedStatus, 'status')
    } else {
      this.updateToRealm(selectedStatus)
    }

    this.setState({ value })
  }

  updateToRealm = (selectedStatus?: ProductStatus) => {
    const { product } = this.state
    const { productStatusFactory, navigation } = this.props
    const productsId = navigation.getParam('productsId', [])

    if (!product) return null

    this._isChoose = true

    if (productsId.length > 0) {
      productStatusFactory
        .updateStatusMultiProduct(
          productsId,
          selectedStatus && selectedStatus.id ? selectedStatus : null
        )
        .subscribe(() => {})
    } else {
      productStatusFactory
        .update(product.id, {
          status: selectedStatus && selectedStatus.id ? selectedStatus : null,
        })
        .subscribe(
          () => {},
          () => {
            console.log('Error while upload status to product')
          }
        )
    }
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
      this._modalIsClose = false
    }
  }

  close = () => {
    if (this._modal && this._modalIsClose === false) {
      this._modal.close()
      this._modalIsClose = true
    }
  }

  Toast = () => {
    const productsId = this.props.navigation.getParam('productsId', [])
    if (productsId.length > 0 && this._isChoose) {
      Toast.next({
        message: I18n.t('totalProductUpdate', {
          total: productsId.length,
          isMany: productsId.length === 1 ? '' : 's',
        }),
      })
    }
  }

  onComplete = debounce(() => {
    this.close()
  }, 100)

  onClear = debounce(() => {
    if (this.state.value) {
      this.onValueChange(null)
    }
  }, 100)

  render() {
    const { value, status, loading } = this.state
    const { navigation } = this.props
    const hideActionBar = navigation.getParam('hideActionBar', false)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)

    return (
      <AModal4
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectStatus, nodeRef)
          createProductNavigation.setRef(CreateProductRef.SelectStatus, nodeRef)
        }}
        onComplete={this.onComplete}
        onClear={this.onClear}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
        showToast={this.Toast}
      >
        {loading ? (
          <AIndicator full />
        ) : (
          <APicker<ProductStatus>
            data={status}
            value={value}
            onValueChange={this.onValueChange}
            renderItem={() => {
              return status.map(stType => (
                <Picker.Item
                  key={stType.id}
                  label={`0${stType.step}. ${SafeStatusType.getName(
                    stType.name
                  )}`}
                  value={stType.id}
                />
              ))
            }}
          />
        )}
      </AModal4>
    )
  }
}
