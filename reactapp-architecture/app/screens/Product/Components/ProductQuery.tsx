import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { DimensionResult } from '@/services/dimension'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, devices, images, metrics } from '@/vars'
import * as React from 'react'
import {
  BackHandler,
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native'
import {
  NavigationInjectedProps,
  NavigationParams,
  withNavigation,
} from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { productStore } from '@/stores/productStore'
import {
  onDeleteProduct,
  searchKeyword,
  SearchKeywordType,
  Toast,
  isVisibleTabBar,
  searchKeywordDashboard,
  totalSelectMulti,
  isSelectMulti,
} from '@/services/global'
import { Paging } from '@/paging'
import { ProductCardSeparator } from '@/cards/Product/ProductCardSeparator'
import { ProductCardFooter } from '@/cards/Product/ProductCardFooter'
import I18n from '@/i18n'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { FooterMultiSelect } from '@/components/AFooterMultiSelect/FooterMultiSelect'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { ProductActionSheet } from '@/screens/Product/Components/ProductActionSheet'
import { ProductSwipeable } from '@/screens/Product/Components/ProductSwipeable'
import { SafeProduct } from '@/shared/product'
import { CustomAlert } from '@/shared/alert'
import { ProductEmpty } from '@/screens/Product/Components/ProductEmpty'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { APlaceholderMultiSearch } from '@/components/APlaceHolder/APlaceholderMultiSearch'
import { debounce } from 'lodash'

type Props = Readonly<{
  multiTypes?: boolean
  query?: string
  type?: SearchKeywordType
  fromMultiSearch?: boolean
  onSelected?: (data: boolean) => void
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  isDeleting: boolean
  products: Realm.Collection<Product>
  orientation: DimensionResult
  loading: boolean
  loadingFull: boolean
  selectedId: string
  change: Realm.CollectionChangeSet
  firstTimeLoadData: boolean
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class ProductQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Product>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _subSubscription: Subscription
  _dimSubscription: Subscription
  _deleteItemSubSubscription: Subscription
  _updateItemSubSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _subscriptionCloseSwipe: Subscription
  _backHandler: any
  _results: Realm.Collection<Product> = [] as any
  _productResults: Realm.Collection<Product> = [] as any
  _fuse: FuseService<Product> = new FuseService<Product>([] as any)
  _paging: Paging<Product> = new Paging<Product>([] as any)
  _after: string = null
  _currentRenderIndex: number = 0
  _keyword: string = ''
  _pagingSearch: Paging<Product> = new Paging<Product>([] as any)
  _afterSearch: string = null
  _actionSheetMultiDeleteRef: any = React.createRef()
  _actionSheetDeleteRef: any = React.createRef()
  _actionSheetArchiveRef: any = React.createRef()
  _actionSheetEditRef: any = React.createRef()
  _productIdCloseSwipe = ''
  _deleteProductId = ''
  _productId = []
  _isSelected = false
  _rows = {}
  _deleteLocal = false
  _isShowEmpty = false

  static defaultProps = {
    fromMultiSearch: false,
    multiTypes: false,
  }

  readonly state: State = {
    isDeleting: false,
    products: [] as any,
    loading: true,
    loadingFull: true,
    orientation: null,
    selectedId: '',
    change: {
      deletions: [],
      insertions: [],
      modifications: [],
      newModifications: [],
      oldModifications: [],
    },
    firstTimeLoadData: true,
  }

  async componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
      this._flatList.current && this._flatList.current.recordInteraction()
    })

    this.backButton()
    this.deleteProduct()
    this.fetchProduct()
  }

  backButton = () => {
    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.onPressClose()
        return false
      }
    )
  }

  componentWillUnmount() {
    this._backHandler.remove()
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    this._dimSubscription && this._dimSubscription.unsubscribe()
    this._updateItemSubSubscription &&
      this._updateItemSubSubscription.unsubscribe()
    this._deleteItemSubSubscription &&
      this._deleteItemSubSubscription.unsubscribe()
    this._productResults && this._productResults.removeAllListeners()
    this._subscriptionCloseSwipe && this._subscriptionCloseSwipe.unsubscribe()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
  }

  statusNormal = data => {
    if (
      data.change.deletions.length > 0 &&
      !data.isDeleteLocal &&
      this._productId.length > 0
    ) {
      CustomAlert.error({
        message: I18n.t('thisProductWasDeleted'),
        onPress: () => {
          this.resetDataLocal()
          this._actionSheetEditRef &&
            this._actionSheetEditRef._cancel &&
            this._actionSheetEditRef._cancel()
          this.props.onSelected(false)
          isSelectMulti.next(false)
          isVisibleTabBar.next(true)
          this.props.navigation.navigate('ProductScreen')
        },
      })
    }
  }

  deleteProduct = () => {
    this._deleteItemSubSubscription = productStore
      .delete()
      .pipe(
        map(value => {
          if (value.index >= this._results.length) {
            return this._results.length - 1
          }

          return value.index
        })
      )
      .subscribe(index => {
        productStore.select().next({
          index,
          item: this._results[index],
        })
      })

    this._updateItemSubSubscription = productStore.update().subscribe(value => {
      this.setState({
        selectedId: value.selectedId,
      })
    })
  }

  fetchProduct = () => {
    const { productFactory, query } = this.props
    const [subscription, results] = productFactory.fetch({
      query,
      isReceiveChange: true,
    })

    this._productResults = results

    this._subscription = subscription.subscribe(data => {
      if (data) {
        this.statusNormal(data)

        this._paging.update(data.col)
        productStore.initSelect = true

        const newProducts = this._paging.getDataFromStart(
          data.change.insertions.length === 0 ? this._currentRenderIndex : 0,
          30
        )

        this._after = this._paging.getLatestId(newProducts)
        this._currentRenderIndex = this._paging.currentIndex(this._after)

        this.resultUpdate(newProducts as any)
        this.searchUpdate(data.col, this.state.firstTimeLoadData)
        if (data.col.length >= 0 && this._keyword.trim().length === 0) {
          this.setState(
            {
              products: newProducts,
              change: data.change,
              loading: false,
              firstTimeLoadData: false,
            },
            () => {
              searchKeyword.next({ text: '', type: this.props.type })
            }
          )
        } else if (data.col.length >= 0 && this._keyword.trim().length !== 0) {
          this.onChangeText(this._keyword)
        }
      }
    })

    this._subSubscription = productFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
          loadingFull: false,
        })
      }
    })
  }

  fetchSearchKeyword = () => {
    const { fromMultiSearch } = this.props

    if (fromMultiSearch) {
      this._updateKeywordSubscription = searchKeywordDashboard.subscribe(
        data => {
          this.onChangeText(data.text)
        }
      )
    } else {
      this._updateKeywordSubscription = searchKeyword.subscribe(data => {
        if (data.type === this.props.type) {
          this.onChangeText(data.text)
        }
      })
    }
  }

  resultUpdate = (products: Realm.Results<Product>) => {
    this._results = products
  }

  searchUpdate = (products, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Product>(products, {
        keys: [
          'name',
          'description',
          'supplier.name',
          'category.name',
          'tags',
        ] as any,
      })
      this.fetchSearchKeyword()
    } else {
      this._fuse.update(products)
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword

      this._isShowEmpty = true

      this.setState({
        products: this._results,
        loading: false,
      })

      return
    }

    this._keyword = keyword
    this.onSearch(keyword)
  }

  onSearch = debounce((keyword: string) => {
    if (keyword.trim().length === 0) {
      this._isShowEmpty = true
      return
    }

    const result = this._fuse.search(keyword.trim())

    this._isShowEmpty = result.data.length <= 0

    this._pagingSearch.update(result.data as any)
    const newProducts = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newProducts)

    this.setState({
      products: newProducts as any,
    })
  }, 100)

  onScrollHandler = () => {
    const { products } = this.state

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextProducts = this._paging.next(this._after)

      this._after = this._paging.getLatestId(nextProducts)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      const newProducts = products.concat(nextProducts)
      this.resultUpdate(newProducts as any)

      this.setState(
        {
          products: newProducts as any,
        },
        () => {
          if (this._productId.length > 0) {
            isVisibleTabBar.next(false)
          }
        }
      )
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextProducts = this._pagingSearch.next(this._afterSearch)
      const newProducts = products.concat(nextProducts)

      this._afterSearch = this._pagingSearch.getLatestId(nextProducts)

      this.setState(
        {
          products: newProducts as any,
        },
        () => {
          if (this._productId.length > 0) {
            isVisibleTabBar.next(false)
          }
        }
      )
    }
  }

  onSelect = (productId: string) => {
    if (this._productId.includes(productId)) {
      this._productId.splice(this._productId.indexOf(productId), 1)
    } else {
      this._productId.push(productId)
    }

    totalSelectMulti.next(this._productId.length)

    if (this._productId.length === 0) {
      this._isSelected = false
      this.props.onSelected(false)
      isSelectMulti.next(false)
      isVisibleTabBar.next(true)
    } else if (this._productId.length === 1) {
      this._isSelected = true
      this.props.onSelected(true)
      isVisibleTabBar.next(false)
    } else {
      this.forceUpdate()
    }
  }

  swipeRightOpen = (id: string) => {
    if (this._productIdCloseSwipe !== '' && this._productIdCloseSwipe !== id) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }
    }
    this._productIdCloseSwipe = id
  }

  swipeLeftOpen = (id: string) => {
    if (
      this._productIdCloseSwipe !== '' &&
      this._productIdCloseSwipe !== id &&
      !this._isSelected
    ) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }
    }
    this._productIdCloseSwipe = id
  }

  onPressDelete = (id: string) => {
    this._deleteProductId = id
    if (this._actionSheetDeleteRef) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }
      this._actionSheetDeleteRef.show()
    }
  }

  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    const { id } = new SafeProduct(item)
    const { fromMultiSearch } = this.props

    return (
      <ProductSwipeable
        _productSwipeRef={row => (this._rows[id] = row)}
        fromMultiSearch={fromMultiSearch}
        product={item}
        index={index}
        onPressDelete={() => this.onPressDelete(id)}
        swipeRightOpen={() => this.swipeRightOpen(id)}
        swipeLeftOpen={() => this.swipeLeftOpen(id)}
        onSelect={() => this.onSelect(id)}
      />
    )
  }

  renderSeparator = () => {
    return <ProductCardSeparator />
  }

  renderFooter = () => {
    const { loadingFull, loading } = this.state
    return (
      <ProductCardFooter
        loading={loadingFull && !loading}
        containerStyle={{
          width: metrics.screen_width - metrics.keylines_screen_edge_margin * 2,
        }}
      />
    )
  }

  onPressSheetArchive = (index: number) => {
    if (index !== 0) return

    const { productFactory } = this.props
    this._deleteLocal = true

    productFactory.updateArchiveMultiProduct(this._productId).subscribe(() => {
      this.props.onSelected(false)
      isSelectMulti.next(false)
      isVisibleTabBar.next(true)
    })

    Toast.next({
      message: I18n.t('productArchive', {
        total: this._productId.length,
        isMany: this._productId.length === 1 ? '' : 's',
      }),
    })

    this.resetDataLocal()
  }

  onPressSheetDelete = (index: number) => {
    if (this._rows[this._productIdCloseSwipe]) {
      this._rows[this._productIdCloseSwipe].close()
    }

    if (index === 0) {
      this.props.productFactory.deleteLocal = true
      this.props.productFactory
        .update(this._deleteProductId, {
          deleted: true,
        })
        .subscribe(() => {
          setTimeout(() => {
            this.props.productFactory.deleteLocal = false
          }, 200)
          onDeleteProduct.next()
        })
      this._productIdCloseSwipe = ''

      Toast.next({
        message: I18n.t('totalProductDelete', { total: 1, isMany: '' }),
      })
      return
    }

    return
  }

  onPressSheetMultiDelete = (index: number) => {
    if (index !== 0) return

    const { productFactory } = this.props
    productFactory.deleteLocal = true
    this.setState({
      isDeleting: true,
    })

    productFactory.deleteMultiProduct(this._productId).subscribe(() => {
      this.setState(
        {
          isDeleting: false,
        },
        () => {
          this.props.onSelected(false)
          isVisibleTabBar.next(true)
          isSelectMulti.next(false)
        }
      )

      setTimeout(() => {
        productFactory.deleteLocal = false
      }, 200)
    })

    Toast.next({
      message: I18n.t('totalProductDelete', {
        total: this._productId.length,
        isMany: this._productId.length === 1 ? '' : 's',
      }),
    })

    this.resetDataLocal()
  }

  resetDataLocal() {
    this._productIdCloseSwipe = ''
    this._isSelected = false
    this._productId = []
  }

  sendData = data => {
    productNavigation.productId = this._productId
    switch (data) {
      case ProductRef.SelectCategory:
      case ProductRef.SelectSupplier:
        productNavigation.open(data, undefined, true)
        break
      case ProductRef.SelectStatus:
        productNavigation.open(data, undefined, false, true)
        break
      default:
    }
  }

  onPressSheetEdit = (index: number) => {
    if (index === 0) {
      this.sendData(ProductRef.SelectCategory)
      return
    }
    if (index === 1) {
      this.sendData(ProductRef.SelectSupplier)
      return
    }
    if (index === 2) {
      this.props.navigation.navigate('SelectPrice', {
        productId: this._productId,
      })
    }
    if (index === 3) {
      this.sendData(ProductRef.SelectStatus)
      return
    }
    if (index === 4) {
      if (this._actionSheetMultiDeleteRef) {
        this._actionSheetMultiDeleteRef.show()
      }
      return
    }
    if (index === 5) {
      if (this._actionSheetArchiveRef) {
        this._actionSheetArchiveRef.show()
      }
      return
    }
    return
  }

  onPressClose = () => {
    this.resetDataLocal()
    this.props.onSelected(false)
    isVisibleTabBar.next(true)
    isSelectMulti.next(false)
  }

  onPressEdit = () => {
    if (this._actionSheetEditRef) {
      this._actionSheetEditRef.show()
    }
  }

  onPressTask = () => {
    this.props.navigation.navigate('CreateTaskPicker', {
      productsId: this._productId,
      // isUpdateSuccess: this.onPressClose,
    })
  }

  onPressSample = () => {
    this.props.navigation.navigate('CreateSamplePicker', {
      productsId: this._productId,
      // isUpdateSuccess: this.onPressClose,
    })
  }

  navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return this.props.navigation.navigate(routeName, params)
  }

  onPressProject = () => {
    this.navigate('SelectMultiProject', {
      hideUpDownClear: true,
      productsId: this._productId,
      type: 'Product',
    })
  }

  footer = () => {
    const { fromMultiSearch } = this.props
    if (fromMultiSearch) {
      return null
    }

    return (
      <View pointerEvents={this.state.isDeleting ? 'none' : 'auto'}>
        <FooterMultiSelect
          onPressTask={this.onPressTask}
          onPressSample={this.onPressSample}
          onPressEdit={this.onPressEdit}
          close={this.onPressClose}
          onPressProject={this.onPressProject}
          title={I18n.t('productSelected', {
            isMany: this._productId.length === 1 ? '' : 's',
          })}
        />
      </View>
    )
  }

  render() {
    const { products, loading } = this.state
    const { fromMultiSearch } = this.props

    if (loading) {
      return <AIndicator full />
    }

    if (!fromMultiSearch && products.length === 0) {
      return <ProductEmpty />
    }

    if (fromMultiSearch && this._isShowEmpty) {
      return (
        <APlaceholderMultiSearch
          hide={false}
          keywordFromProps={this._keyword}
        />
      )
    }

    return (
      <View style={styles.container}>
        <FlatList<Product>
          ref={this._flatList}
          data={products}
          extraData={products}
          keyExtractor={(item, _index) => item.id}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          style={styles.list}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps={'always'}
          onEndReached={this.onScrollHandler}
          bounces={false}
          onEndReachedThreshold={0.3}
          windowSize={61}
          initialNumToRender={30}
          maxToRenderPerBatch={30}
          updateCellsBatchingPeriod={0}
          showsVerticalScrollIndicator={false}
        />

        <ProductActionSheet
          _actionSheetDeleteRef={nodeRef => {
            this._actionSheetDeleteRef = nodeRef
          }}
          _actionSheetMultiDeleteRef={nodeRef => {
            this._actionSheetMultiDeleteRef = nodeRef
          }}
          _actionSheetArchiveRef={nodeRef => {
            this._actionSheetArchiveRef = nodeRef
          }}
          _actionSheetEditRef={nodeRef => {
            this._actionSheetEditRef = nodeRef
          }}
          totalProduct={this._productId.length}
          onPressSheetArchive={this.onPressSheetArchive}
          onPressSheetDelete={this.onPressSheetDelete}
          onPressSheetMultiDelete={this.onPressSheetMultiDelete}
          onPressSheetEdit={this.onPressSheetEdit}
        />

        {this.footer()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  list: {
    flex: 1,
  },
})
