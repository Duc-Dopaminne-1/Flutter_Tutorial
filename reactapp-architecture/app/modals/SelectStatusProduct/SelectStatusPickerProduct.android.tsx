import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, ProductStatus, Project } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { pathOr, clone } from 'ramda'
import * as React from 'react'
import { FlatListProps } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { SelectStatusListProduct } from './Components/SelectStatusList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { debounce } from 'lodash'
import { Toast } from '@/services/global'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      isCreateProduct?: boolean
      product?: Product
      productsId?: string[]
      status: ProductStatus
      setValue?: (data, key) => void
      hideActionBar?: boolean
      hideUpDownClear?: boolean
    }>
  >

export type State = Readonly<{
  status: Realm.Collection<ProductStatus>
  product: SafeProduct
  keyword: string
  loading: boolean
  value: string
  renderKey: number
}>

@withContext(AppContext.Consumer)
export class SelectStatusPickerProduct extends React.PureComponent<
  Props,
  State
> {
  _flatListRef: React.RefObject<
    FlatListProps<ProductStatus>
  > = React.createRef()
  _fuse: FuseService<ProductStatus> = new FuseService<ProductStatus>([] as any)
  _subscription: Subscription
  _textInput: React.RefObject<any> = React.createRef()
  _results: Realm.Results<ProductStatus> = [] as any
  _modal
  _isChoose = false
  _modalIsClose = true

  static readonly defaultProps = defaultProps

  readonly state: State = {
    keyword: '',
    status: [] as any,
    loading: true,

    product: null,
    value: '',
    renderKey: 0,
  }

  componentDidMount() {
    this.open()

    const { productStatusFactory, navigation } = this.props

    const isCreateProduct = navigation.getParam('isCreateProduct', null)
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

    this.focusKeyboard()

    const [subscription, results] = productStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(productStatus => {
      this.setState(
        {
          status: productStatus,
        },
        () => {
          this.forceUpdate()
        }
      )

      // if (productStatus && productStatus.length > 0) {
      //   const newData = clone(productStatus)
      //   newData[0].name = I18n.t('newProduct')
      //   this._fuse = new FuseService<ProductStatus>(newData)
      //   return
      // }

      this._fuse = new FuseService<ProductStatus>(productStatus)
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  focusKeyboard = () => {
    setTimeout(() => {
      this._textInput.current && this._textInput.current.focus()
    }, 400)
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        status: this.props.productStatusFactory.sortData,
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

  onSelect = debounce((productStatus: ProductStatus) => {
    this._isChoose = true
    const { navigation } = this.props
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    if (isCreateProduct && setValue) {
      setValue(productStatus, 'status')
      this.close()
    } else {
      this.updateToRealm(productStatus)
    }
  }, 100)

  updateToRealm = (productStatus: ProductStatus) => {
    const { product, value } = this.state
    const { productStatusFactory, navigation } = this.props
    const { status } = product.safeStatus
    const productsId = navigation.getParam('productsId', [])

    if (!product) return null

    if (
      !productStatus ||
      !productStatus.id ||
      (status && value === productStatus.id)
    ) {
      this.close()
      return
    }
    // if (status && value === productStatus.id) {
    //   console.tron('vao close')
    //   this.close()
    //   return
    // }

    if (productsId.length > 0) {
      productStatusFactory
        .updateStatusMultiProduct(
          productsId,
          productStatus && productStatus.id ? productStatus : null
        )
        .subscribe(() => {})

      this.close()
    } else {
      productStatusFactory
        .update(product.id, {
          status: productStatus && productStatus.id ? productStatus : null,
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
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      status: result.data as any,
    })
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

  onClear = debounce(() => {
    if (this.state.keyword !== '') {
      this.setState({
        status: this.props.productStatusFactory.sortData,
        keyword: '',
        renderKey: this.state.renderKey + 1,
      })

      // this._fuse.update(this._results || ([] as any))
    }
  }, 100)

  onComplete = () => {
    this.close()
  }

  render() {
    const { keyword, status, renderKey } = this.state
    const { navigation } = this.props
    const hideActionBar = navigation.getParam('hideActionBar', false)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectStatus, nodeRef)
          createProductNavigation.setRef(CreateProductRef.SelectStatus, nodeRef)
        }}
        showToast={this.Toast}
        headerProps={{
          title: I18n.t('selectStatus'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('searchForAStatus'),
        }}
        onClear={this.onClear}
        renderKey={renderKey}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
      >
        <SelectStatusListProduct
          flatListRef={this._flatListRef}
          onPress={this.onSelect}
          data={status}
          keyword={keyword.trim()}
        />
      </AModal3>
    )
  }
}
