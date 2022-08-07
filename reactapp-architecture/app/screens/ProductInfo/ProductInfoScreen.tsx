import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { Product } from '@/models/team'
import { navigation, Screen } from '@/navigation/navigation'
import { ProductData, productNavigation } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProductInfoContent } from '@/screens/ProductInfo/Components/ProductInfoContent'
import { NavigationService } from '@/services/navigation'
import { isIpad } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import { devices } from '@/vars'
import { debounce } from 'lodash'
import * as React from 'react'
import { Dimensions, StatusBar, StyleSheet } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { ProductInfoImage } from './Components/ProductInfoImage'
import { ProductInfoContext } from './ProductInfoContext'
import { Dimension, Orientation } from '@/services/dimension'
import I18n from '@/i18n'
import { productStore } from '@/stores/productStore'
import {
  onDeleteProduct,
  onProductChangeById,
  updateProductInfo,
  onItemCreated,
} from '@/services/global'
import { CustomAlert } from '@/shared/alert'
import { SafeProduct } from '@/shared/product'
import { ProductInfoActionBar } from '@/screens/ProductInfo/Components/ProductInfoActionBar'

// init state
const initialState = {
  product: null,
  loading: true,
  errMsg: null,
  headerVisible: true,
  imageData: [],
  keyboardIsShowUp: false,
  dimension: Dimension.isPortrait
    ? Orientation.Portrait
    : Orientation.Landscape,
  isBack: false,
  like: false,
  disableActionBar: false,
}

type Props = Readonly<{
  imageData: string[]
  productId: string
  wasCreated: boolean
  layoutWidth: number
  asComponent: boolean
  selectedIndex: number
}> &
  NavigationInjectedProps<{
    imageData: string[]
    productId: string
    wasCreated: boolean
  }> &
  AppContextState

export type State = Readonly<{
  product: Product
  loading: boolean
  errMsg: string
  headerVisible: boolean
  imageData: string[]
  dimension: any
  keyboardIsShowUp: boolean
  isBack: boolean
  like: boolean
  disableActionBar: boolean
}>

@withContext(AppContext.Consumer)
export class ProductInfoScreen extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _subscriptionRotate: Subscription
  _results: Realm.Results<Product>
  _timer: NodeJS.Timeout = null
  _isDeletedByMyself = false
  _safeProduct: SafeProduct = new SafeProduct(null)

  readonly state: State = initialState

  static readonly defaultProps = {
    productId: '',
    imageData: [],
  }

  constructor(props) {
    super(props)
    navigation.currentScreen = Screen.ProductInfo
  }

  componentDidMount() {
    productNavigation.productId = []
    const {
      navigation,
      productFactory,
      asComponent,
      productId: _productId,
      imageData: _imageData,
    } = this.props

    this._navListener.didFocus(() => {
      !asComponent && StatusBar.setBarStyle('light-content', true)
      devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    })

    const productId = navigation.getParam('productId', _productId)
    const imageData = navigation.getParam('imageData', _imageData)

    const [subscription, results] = productFactory.fetchById(productId, true)

    this._results = results

    this._subscription = subscription.subscribe(data => {
      this.setProductData(data.col, imageData)

      if (data.change.deletions.length === 0) {
        onProductChangeById.next(data.col)
      }
    })

    this.handleRotate()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
    this._results && this._results.removeAllListeners()
    clearTimeout(this._timer)

    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    navigation.removeLastScreen()
    productNavigation.clear()
  }

  get isActiveHeader() {
    const { headerVisible } = this.state
    const { asComponent } = this.props

    if (!asComponent) {
      return headerVisible
    }

    return headerVisible && !isIpad()
  }

  handleRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        // @ts-ignore
        this.setState({
          dimension: value,
        })
      }
    })
  }

  setProductData = (product: Product, imageData: string[] = []) => {
    if (product && product.isValid()) {
      clearTimeout(this._timer)

      // update safe product
      this._safeProduct.product = product

      const { convertProductToObject, favorite } = this._safeProduct

      productNavigation.setData(ProductData.Product, convertProductToObject)

      this.setState({
        imageData,
        product: convertProductToObject,
        loading: false,
        like: favorite,
      })

      // update data product in ProductInfoDetailForm
      updateProductInfo.next(convertProductToObject)
    } else {
      this.setState({
        loading: true,
      })

      const { asComponent, selectedIndex } = this.props
      if (asComponent && isIpad()) {
        productStore.delete().next({
          index: selectedIndex,
        })
      } else {
        this.onShowAlert()
      }
    }
  }

  onShowAlert = () => {
    productNavigation.closeAllModal()

    if (!this._isDeletedByMyself) {
      CustomAlert.error({
        message: I18n.t('thisProductWasDeleted'),
        onPress: () => {
          this.props.navigation.goBack()
        },
      })
    }
  }

  onDelete = () => {
    const {
      productFactory,
      navigation,
      selectedIndex,
      asComponent,
    } = this.props
    const { product } = this.state
    // const productId = navigation.getParam('productId', _productId)

    productFactory
      .update(product.id, {
        deleted: true,
      })
      .subscribe(() => {
        onDeleteProduct.next()
        if (asComponent && isIpad()) {
          productStore.delete().next({
            index: selectedIndex,
          })
        } else {
          this._isDeletedByMyself = true
          setTimeout(() => {
            navigation.goBack()
          }, 10)
        }
      })
  }

  onLike = debounce(() => {
    const { productFactory } = this.props
    const { product, like } = this.state

    this.setState((prevState: State) => ({
      like: !prevState.like,
    }))

    productFactory
      .update(product.id, {
        favorite: !like,
      })
      .subscribe(() => {})
  }, 100)

  onChangeHeaderVisibility = (state: boolean) => {
    this.setState({
      headerVisible: state,
    })

    if (!this.props.asComponent) {
      const barStyle = state ? 'light-content' : 'dark-content'
      StatusBar.setBarStyle(barStyle, true)
    }
  }

  onPressIconLeft = () => {
    this.setState({
      isBack: true,
    })

    this.props.navigation.goBack()
  }

  renderBackground = () => {
    const { product, imageData } = this.state
    const { navigation, wasCreated: _wasCreated, layoutWidth } = this.props
    const wasCreated = navigation.getParam('wasCreated', _wasCreated)

    return (
      <ProductInfoImage
        layoutWidth={layoutWidth}
        product={product}
        imageData={imageData}
        wasCreated={wasCreated}
      />
    )
  }

  setKeyboardIsShowUp = (keyboardIsShowUp: boolean) => {
    this.setState({ keyboardIsShowUp })
  }

  onComment = (text: string, cb: (clear: boolean) => void) => {
    const { productFactory, commentFactory } = this.props
    const { product } = this.state
    if (!product) {
      return
    }

    commentFactory.create({ text }).subscribe(
      comment => {
        productFactory.comment(product.id, comment).subscribe(newProduct => {
          cb && cb(true)
          if (newProduct) {
            this.setState({ product: newProduct })
          }
          onItemCreated.next({
            product,
            type: 'comment',
            commentType: 'product',
            id: comment.id,
          })
        })
      },
      err => {
        console.warn('Error creating comment', err)
      }
    )
  }

  onCommentInputFocus = (isFocused: boolean) => {
    this.setState({ disableActionBar: isFocused })
  }

  renderNetWorkStatus = () => {
    const { keyboardIsShowUp } = this.state
    const { asComponent } = this.props

    if (keyboardIsShowUp || asComponent) return null

    return <ANetworkStatus fillAbsolute />
  }

  render() {
    const { loading, isBack, product, like, disableActionBar } = this.state
    const { layoutWidth, asComponent } = this.props
    const headerHeight = layoutWidth
      ? layoutWidth
      : Dimensions.get('screen').width

    if (loading) {
      return <AIndicator full />
    }

    return (
      <ProductInfoContext.Provider
        value={{
          product,
          like,
          isBack,
          asComponent,
          safeProduct: this._safeProduct,
          onDelete: this.onDelete,
          headerVisible: this.isActiveHeader,
          onLike: this.onLike,
          onPressIconLeft: this.onPressIconLeft,
          onSend: this.onComment,
          onCommentInputFocus: this.onCommentInputFocus,
        }}
      >
        <ProductInfoContent
          renderBackground={this.renderBackground}
          onChangeHeaderVisibility={this.onChangeHeaderVisibility}
          headerHeight={headerHeight}
        />


      </ProductInfoContext.Provider>
    )
  }
}
