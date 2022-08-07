import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierContext } from '@/screens/Supplier/SupplierContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, devices, metrics } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import { BackHandler, FlatList, Keyboard, StyleSheet, View } from 'react-native'
import {
  NavigationInjectedProps,
  NavigationParams,
  withNavigation,
} from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { supplierStore } from '@/stores/supplierStore'
import { map } from 'rxjs/operators'
import {
  isSelectMulti,
  isVisibleTabBar,
  onDeleteSupplier,
  searchKeyword,
  searchKeywordDashboard,
  SearchKeywordType,
  Toast,
  totalSelectMulti,
} from '@/services/global'
import { Paging } from '@/paging'
import { filter, groupBy, pipe } from 'ramda'
import { ProductCardFooter } from '@/cards/Product/ProductCardFooter'
import I18n from '@/i18n'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { FooterMultiSelect } from '@/components/AFooterMultiSelect/FooterMultiSelect'
import { navigation } from '@/navigation/navigation'
import { CustomAlert } from '@/shared/alert'
import { SupplierActionSheet } from '@/screens/Supplier/Components/SupplierActionSheet'
import { SupplierSwipeable } from '@/screens/Supplier/Components/SupplierSwipeable'
import { SafeSupplier } from '@/shared/supplier'
import { SupplierEmpty } from '@/screens/Supplier/Components/SupplierEmpty'
import { APlaceholderMultiSearch } from '@/components/APlaceHolder/APlaceholderMultiSearch'
import { debounce } from 'lodash'

type Props = Readonly<{
  type?: SearchKeywordType
  query?: string
  multiTypes?: boolean
  onSelected?: (data: boolean) => void
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  suppliers: Realm.Collection<Supplier>
  loading: boolean
  loadingFull: boolean
  selectedId: string
  firstTimeLoadData: boolean
  isDeleting: boolean
}>

@withContext(SupplierContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SupplierQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<any>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _fuse: FuseService<Supplier> = new FuseService<Supplier>([] as any)
  _results: Realm.Results<Supplier> = [] as any
  _subscription: Subscription
  _subSubscription: Subscription
  _deleteItemSubSubscription: Subscription
  _updateItemSubSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _subscriptionCloseSwipe: Subscription
  _paging: Paging<Supplier> = new Paging<Supplier>([] as any)
  _after: string = null
  _currentRenderIndex: number = 0
  _keyword: string = ''
  _pagingSearch: Paging<Supplier> = new Paging<Supplier>([] as any)
  _afterSearch: string = null
  _actionSheetMultiDeleteRef: any = React.createRef()
  _actionSheetDeleteRef: any = React.createRef()
  _actionSheetEditRef: any = React.createRef()
  _deleteSupplierId = ''
  _supplierId = []
  _supplierIdCloseSwipe = ''
  _isSelected = false
  _rows = {}
  _backHandler: any
  _isShowEmpty = false

  state: State = {
    isDeleting: false,
    suppliers: [] as any,
    loading: true,
    loadingFull: true,
    selectedId: '',
    firstTimeLoadData: true,
  }

  static defaultProps = {
    fromMultiSearch: false,
    multiTypes: false,
  }

  async componentDidMount() {
    this._navListener.setBarStyle('light-content')

    this.backButton()
    this.deleteSupplier()
    this.fetchSupplier()
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
    this._subSubscription && this._subSubscription.unsubscribe()
    this._results &&
      this._results.removeAllListeners &&
      this._results.removeAllListeners()
    this._updateKeywordSubscription &&
      this._updateKeywordSubscription.unsubscribe()
    this._subscriptionCloseSwipe && this._subscriptionCloseSwipe.unsubscribe()
    this._updateItemSubSubscription &&
      this._updateItemSubSubscription.unsubscribe()
    this._deleteItemSubSubscription &&
      this._deleteItemSubSubscription.unsubscribe()
  }

  statusNormal = data => {
    if (
      data.change.deletions.length > 0 &&
      !data.isDeleteLocal &&
      this._supplierId.length > 0
    ) {
      CustomAlert.error({
        message: I18n.t('thisSupplierWasDeleted'),
        onPress: () => {
          this.resetDataLocal()
          this._actionSheetEditRef &&
            this._actionSheetEditRef._cancel &&
            this._actionSheetEditRef._cancel()
          this.props.onSelected(false)
          isSelectMulti.next(false)
          isVisibleTabBar.next(true)
          this.props.navigation.navigate('SupplierScreen')
        },
      })
    }
  }

  resetDataLocal() {
    this._supplierIdCloseSwipe = ''
    this._isSelected = false
    this._supplierId = []
  }

  deleteSupplier = () => {
    this._deleteItemSubSubscription = supplierStore
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
        supplierStore.select().next({
          index,
          item: this._results[index],
        })
      })

    this._updateItemSubSubscription = supplierStore
      .update()
      .subscribe(value => {
        this.setState({
          selectedId: value.selectedId,
        })
      })
  }

  fetchSupplier = () => {
    const { supplierFactory, query } = this.props

    if (!supplierFactory) return

    const [subscription, results] = supplierFactory.fetch({
      query,
      isReceiveChange: true,
    })

    this._results = results

    this._subscription = subscription.subscribe(suppliers => {
      this.statusNormal(suppliers)

      this._paging.update(suppliers.col)
      this.createMySupplierListId(suppliers.col)

      supplierStore.initSelect = true
      const newSuppliers = this._paging.getDataFromStart(
        suppliers.change.insertions.length === 0 ? this._currentRenderIndex : 0,
        30
      )

      this._after = this._paging.getLatestId(newSuppliers)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      this.resultUpdate(newSuppliers)
      this.searchUpdate(suppliers.col, this.state.firstTimeLoadData)

      if (suppliers.col.length >= 0 && this._keyword.trim().length === 0) {
        this._keyword = ''
        this.setState(
          {
            suppliers: newSuppliers,
            loading: false,
            firstTimeLoadData: false,
          },
          () => {
            searchKeyword.next({ text: '', type: this.props.type })
          }
        )
      } else if (
        suppliers.col.length >= 0 &&
        this._keyword.trim().length !== 0
      ) {
        this.onChangeText(this._keyword)
      }
    })

    this._subSubscription = supplierFactory.subject().subscribe(value => {
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

  createMySupplierListId = suppliers => {
    const { type } = this.props
    if (type === SearchKeywordType.MySupplier) return

    const listId = pipe(
      filter<Supplier>(value => !!value.globalDatabaseId),
      groupBy<Supplier>(value => value.globalDatabaseId) as any
    )(suppliers)

    supplierStore.supplierListId = listId
    supplierStore.supplierListIdSub.next(listId as any)
  }

  resultUpdate = suppliers => {
    this._results = suppliers
  }

  searchUpdate = (suppliers, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Supplier>(suppliers, {
        keys: ['name', 'fullName'] as any,
      })
      this.fetchSearchKeyword()
    } else {
      this._fuse.update(suppliers)
    }
  }

  onScrollHandler = () => {
    const { suppliers } = this.state

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextSuppliers = this._paging.next(this._after)

      this._after = this._paging.getLatestId(nextSuppliers)
      this._currentRenderIndex = this._paging.currentIndex(this._after)

      const newSuppliers = suppliers.concat(nextSuppliers)
      this.resultUpdate(newSuppliers)

      this.setState(
        {
          suppliers: newSuppliers as any,
        },
        () => {
          if (this._supplierId.length > 0) {
            isVisibleTabBar.next(false)
          }
        }
      )
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextSuppliers = this._pagingSearch.next(this._afterSearch)
      const newSuppliers = suppliers.concat(nextSuppliers)

      this._afterSearch = this._paging.getLatestId(nextSuppliers)

      this.setState(
        {
          suppliers: newSuppliers as any,
        },
        () => {
          if (this._supplierId.length > 0) {
            isVisibleTabBar.next(false)
          }
        }
      )
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword

      this._isShowEmpty = true

      this.setState({
        suppliers: this._results,
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
    const newSupplier = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newSupplier)

    this.setState({
      suppliers: newSupplier,
    })
  }, 100)

  onSelect = (supplierId: string) => {
    if (this._supplierId.includes(supplierId)) {
      this._supplierId.splice(this._supplierId.indexOf(supplierId), 1)
    } else {
      this._supplierId.push(supplierId)
    }

    totalSelectMulti.next(this._supplierId.length)

    if (this._supplierId.length === 0) {
      this._isSelected = false
      this.props.onSelected(false)
      isSelectMulti.next(false)
      isVisibleTabBar.next(true)
    } else if (this._supplierId.length === 1) {
      this._isSelected = true
      this.props.onSelected(true)
      isVisibleTabBar.next(false)
    } else {
      this.forceUpdate()
    }
  }

  onPressDelete = (id: string) => {
    this._deleteSupplierId = id
    if (this._actionSheetDeleteRef) {
      if (this._rows[this._supplierIdCloseSwipe]) {
        this._rows[this._supplierIdCloseSwipe].close()
      }
      this._actionSheetDeleteRef.show()
    }
  }

  swipeRightOpen = (id: string) => {
    if (
      this._supplierIdCloseSwipe !== '' &&
      this._supplierIdCloseSwipe !== id
    ) {
      if (this._rows[this._supplierIdCloseSwipe]) {
        this._rows[this._supplierIdCloseSwipe].close()
      }
    }
    this._supplierIdCloseSwipe = id
  }

  swipeLeftOpen = (id: string) => {
    if (
      this._supplierIdCloseSwipe !== '' &&
      this._supplierIdCloseSwipe !== id &&
      !this._isSelected
    ) {
      if (this._rows[this._supplierIdCloseSwipe]) {
        this._rows[this._supplierIdCloseSwipe].close()
      }
    }
    this._supplierIdCloseSwipe = id
  }

  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    const { id } = new SafeSupplier(item)
    const { fromMultiSearch } = this.props

    return (
      <SupplierSwipeable
        _supplierSwipeRef={row => (this._rows[id] = row)}
        fromMultiSearch={fromMultiSearch}
        supplier={item}
        index={index}
        onPressDelete={() => this.onPressDelete(id)}
        swipeRightOpen={() => this.swipeRightOpen(id)}
        swipeLeftOpen={() => this.swipeLeftOpen(id)}
        onSelect={() => this.onSelect(id)}
      />
    )
  }

  renderSeparator = () => {
    return <View style={styles.separator} />
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

  onPressSheetDelete = (index: number) => {
    if (this._rows[this._supplierIdCloseSwipe]) {
      this._rows[this._supplierIdCloseSwipe].close()
    }

    if (index === 0) {
      this.props.supplierFactory.deleteLocal = true
      this.props.supplierFactory
        .update(this._deleteSupplierId, {
          deleted: true,
        })
        .subscribe(() => {
          setTimeout(() => {
            this.props.supplierFactory.deleteLocal = false
          }, 200)
          onDeleteSupplier.next()
        })

      this._supplierIdCloseSwipe = ''

      Toast.next({
        message: I18n.t('totalSupplierDelete', {
          total: 1,
          isMany: '',
        }),
      })
      return
    }

    return
  }

  onPressSheetMultiDelete = (index: number) => {
    if (index !== 0) return

    const { supplierFactory } = this.props

    supplierFactory.deleteLocal = true
    this.setState({
      isDeleting: true,
    })

    supplierFactory.deleteMultiSupplier(this._supplierId).subscribe(() => {
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
        supplierFactory.deleteLocal = false
      }, 200)

      onDeleteSupplier.next()
    })

    Toast.next({
      message: I18n.t('totalSupplierDelete', {
        total: this._supplierId.length,
        isMany: this._supplierId.length === 1 ? '' : 's',
      }),
    })

    this.resetDataLocal()
  }

  navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  onPressSheetEdit = (index: number) => {
    if (index === 0) {
      this.navigate('SelectMultiCategory', {
        hideUpDownClear: true,
        type: 'Supplier',
        suppliersId: this._supplierId,
      })
      return
    }
    if (index === 1) {
      this.navigate('SelectMultiTag', {
        type: 'Supplier',
        suppliersId: this._supplierId,
        hideUpDownClear: true,
      })
      return
    }
    if (index === 2) {
      this.navigate('SelectStatusPickerSupplier', {
        suppliersId: this._supplierId,
        hideUpDownClear: true,
        hideActionBar: false,
      })
      return
    }
    if (index === 3) {
      this._actionSheetMultiDeleteRef.show()
      return
    }
    return
  }

  onPressClose = () => {
    this.resetDataLocal()
    this.props.onSelected(false)
    isSelectMulti.next(false)
    isVisibleTabBar.next(true)
  }

  onPressEdit = () => {
    this._actionSheetEditRef.show()
  }

  onPressTask = () => {
    this.props.navigation.navigate('CreateTaskPicker', {
      suppliersId: this._supplierId,
      // isUpdateSuccess: this.onPressClose,
    })
  }

  onPressSample = () => {
    this.props.navigation.navigate('CreateSamplePicker', {
      suppliersId: this._supplierId,
      // isUpdateSuccess: this.onPressClose,
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
          isShowProject={false}
          isShowAddSample={false}
          title={I18n.t('supplierSelected', {
            isMany: this._supplierId.length === 1 ? '' : 's',
          })}
        />
      </View>
    )
  }

  render() {
    const { suppliers } = this.state
    const { fromMultiSearch } = this.props

    if (!fromMultiSearch && suppliers.length === 0) {
      return <SupplierEmpty />
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
        <FlatList
          ref={this._flatList}
          data={suppliers}
          extraData={suppliers}
          keyExtractor={(item, _index) => item.id}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
          onScrollBeginDrag={Keyboard.dismiss}
          style={styles.list}
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

        <SupplierActionSheet
          _actionSheetDeleteRef={nodeRef => {
            this._actionSheetDeleteRef = nodeRef
          }}
          _actionSheetMultiDeleteRef={nodeRef => {
            this._actionSheetMultiDeleteRef = nodeRef
          }}
          _actionSheetEditRef={nodeRef => {
            this._actionSheetEditRef = nodeRef
          }}
          totalSupplier={this._supplierId.length}
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
    flex: 1,
    backgroundColor: colors.white,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.separator,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: metrics.triple_base,
  },
  text: {
    fontSize: fonts.size.m,
  },
})
