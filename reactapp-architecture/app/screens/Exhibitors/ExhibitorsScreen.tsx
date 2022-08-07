import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, images, metrics } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { Paging } from '@/paging'
import { SafeEvent } from '@/shared/event'
import { Booth } from '@/models/global'
import { GlobalSupplierCard } from '@/cards/Supplier/GlobalSupplierCard'
import { SafeBooth } from '@/shared/booth'
import { isIpad } from '@/shared/devices'
import { globalSupplierStore } from '@/stores/globalSupplierStore'
import { debounce } from 'lodash'
import I18n from '@/i18n'
import { AHeader4 } from '@/components/AHeader/AHeader4'
import { filter, groupBy, pipe } from 'ramda'
import { Supplier } from '@/models/team'

type Props = Readonly<{}> &
  Partial<
    NavigationInjectedProps<{
      eventId: string
    }>
  > &
  AppContextState

export type State = Readonly<{
  booths: Realm.Collection<Booth>
  loading: boolean
  selectedId: string
  listId: any
  firstTimeLoadData: boolean
  keyword: string
}>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ExhibitorsScreen extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<any>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _subSubscription: Subscription
  _updateItemSubSubscription: Subscription
  _updateEventSub: Subscription
  _fuse: FuseService<Booth> = new FuseService<Booth>([] as any)
  _results: Realm.Collection<Booth> = [] as any
  _listIDSubscription: Subscription
  _paging: Paging<Booth> = new Paging<Booth>([] as any)
  _after: string = null
  _pagingSearch: Paging<Booth> = new Paging<Booth>([] as any)
  _afterSearch: string = null

  readonly state: State = {
    booths: [] as any,
    loading: true,
    selectedId: '',
    listId: {},
    firstTimeLoadData: true,
    keyword: '',
  }

  async componentDidMount() {
    this._navListener.setBarStyle('light-content')
    this.fetchMySupplierListId()
    this.fetchSupplier()
    this.updateItemSubscription()
  }

  shouldComponentUpdate(
    _nextProps: Readonly<Props>,
    nextState: Readonly<State>,
    _nextContext: any
  ) {
    /**
     * Check booths
     */
    const convertCurrentBooths = JSON.stringify(this.state.booths)
    const convertNextBooths = JSON.stringify(nextState.booths)

    if (convertCurrentBooths !== convertNextBooths) return true

    /**
     * Check loading
     */
    const convertCurrentLoading = JSON.stringify(this.state.loading)
    const convertNextLoading = JSON.stringify(nextState.loading)

    if (convertCurrentLoading !== convertNextLoading) return true

    /**
     * Check selectedId
     */
    if (this.state.selectedId !== nextState.selectedId) return true

    /**
     * Check listId
     */
    const convertCurrentListId = JSON.stringify(this.state.listId)
    const convertNextListId = JSON.stringify(nextState.listId)

    if (convertCurrentListId !== convertNextListId) return true

    /**
     * Check firstTimeLoadData
     */
    const convertCurrentFirstTimeLoadData = JSON.stringify(
      this.state.firstTimeLoadData
    )
    const convertNextFirstTimeLoadData = JSON.stringify(
      nextState.firstTimeLoadData
    )

    if (convertCurrentFirstTimeLoadData !== convertNextFirstTimeLoadData)
      return true

    /**
     * Check keyword
     */
    if (this.state.keyword !== nextState.keyword) return true

    return false
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._updateEventSub && this._updateEventSub.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._updateItemSubSubscription &&
      this._updateItemSubSubscription.unsubscribe()
  }

  fetchSupplier = () => {
    const { globalEventFactory, navigation } = this.props
    const eventId = navigation.getParam('eventId', '')

    if (!eventId) return

    const [subscription] = globalEventFactory.fetchById(eventId)

    this._subscription = subscription.subscribe(event => {
      const { booths } = new SafeEvent(event)

      /**
       * sort booth list A - Z depend on supplier name
       */
      const sortBooth =
        booths && booths.sorted ? booths.sorted('supplier.name') : []

      /**
       * init data to cut the booths list to a small part
       */
      globalSupplierStore.initSelect = true
      this._paging.update(sortBooth as any)
      const newBooths = this._paging.next(null, 30)
      this._after = this._paging.getLatestId(newBooths)
      this.resultUpdate(newBooths)

      /**
       * Update new booths list to Fuse to search
       */
      this.searchUpdate(sortBooth, this.state.firstTimeLoadData)

      /**
       * if user is searching. Then don't update date to state
       */
      if (this.state.keyword.trim().length === 0) {
        this.setState(
          {
            booths: newBooths,
            loading: false,
            firstTimeLoadData: false,
          },
          () => {
            this.onChangeText('')
          }
        )
      } else if (
        newBooths.length >= 0 &&
        this.state.keyword.trim().length !== 0
      ) {
        this.onChangeText(this.state.keyword)
      }
    })

    this._subSubscription = globalEventFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({ loading: false })
      }
    })
  }

  fetchMySupplierListId = () => {
    const { supplierFactory } = this.props

    const [subscription] = supplierFactory.fetch()

    this._listIDSubscription = subscription.subscribe(suppliers => {
      const listId = pipe(
        filter<Supplier>(value => !!value.globalDatabaseId),
        groupBy<Supplier>(value => value.globalDatabaseId) as any
      )(suppliers)

      this.setState({
        listId: listId as any,
      })
    })
  }

  updateItemSubscription = () => {
    this._updateItemSubSubscription = globalSupplierStore
      .update()
      .subscribe(value => {
        this.setState({
          selectedId: value.selectedId,
        })
      })
  }

  resultUpdate = booths => {
    this._results = booths
  }

  searchUpdate = (booths, isFirstTime: boolean = false) => {
    if (isFirstTime) {
      this._fuse = new FuseService<Booth>(booths, {
        keys: ['boothName', 'supplier.name'] as any,
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        threshold: 0.4,
        findAllMatches: true,
        location: 0,
        distance: 1000,
        maxPatternLength: 1,
        minMatchCharLength: 100,
      })
    } else {
      this._fuse.update(booths)
    }
  }

  onPressCard = debounce(
    (boothId: string, mySupplier: any, index: number = 0) => {
      const { navigation } = this.props

      if (!isIpad()) {
        if (mySupplier) {
          navigation.navigate('SupplierInfoScreen', {
            supplierId: mySupplier.id,
          })
          return
        }

        navigation.navigate('GlobalSupplierInfoScreen', {
          boothId,
          index,
        })
      } else {
        if (mySupplier) {
          globalSupplierStore.select().next({
            index,
            item: mySupplier,
          })
          return
        }

        navigation.navigate('GlobalSupplierInfoScreen', {
          boothId,
          index,
        })
      }
    },
    250
  )

  onScrollHandler = () => {
    const { booths, keyword } = this.state

    if (!this._paging.isEnd(this._after) && keyword.trim().length === 0) {
      const nextBooths = this._paging.next(this._after)
      const newBooths = booths.concat(nextBooths)

      this._after = this._paging.getLatestId(nextBooths)
      this.resultUpdate(newBooths)

      this.setState({
        booths: newBooths as any,
      })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      keyword.trim().length > 0
    ) {
      const nextBooths = this._pagingSearch.next(this._afterSearch)
      const newBooths = booths.concat(nextBooths)

      this._afterSearch = this._paging.getLatestId(nextBooths)

      this.setState({
        booths: newBooths as any,
      })
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        booths: this._results,
      })
      return
    }

    this.setState({
      keyword,
    })
    this.onSearch(keyword)
  }

  onSearch = debounce((keyword: string) => {
    if (keyword.trim().length === 0) return
    const result = this._fuse.search(keyword.trim())

    this._pagingSearch.update(result.data as any)
    const newBooths = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newBooths)

    this.setState({
      booths: newBooths,
    })
  }, 100)

  goBack = () => {
    this.props.navigation.goBack(null)
  }

  onFocus = (isFocus: boolean) => {
    if (!isFocus) return
    const params = {
      offset: 0,
      animated: true,
    }

    this._flatList.current && this._flatList.current.scrollToOffset(params)
  }

  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    const { supplier, boothId } = new SafeBooth(item)
    const isSelected = isIpad() && this.state.selectedId === supplier.id
    const isMySupplier = !!this.state.listId[supplier.id]
    const mySupplier =
      isMySupplier && this.state.listId[supplier.id][0]
        ? this.state.listId[supplier.id][0]
        : null

    return (
      <GlobalSupplierCard
        booths={item}
        mySupplier={mySupplier}
        onPress={() => this.onPressCard(boothId, mySupplier, index)}
        isGlobalSupplier={!isMySupplier}
        selected={isSelected}
      />
    )
  }

  renderSeparator = () => {
    return <View style={styles.separator} />
  }

  renderFlatList = () => {
    const { booths } = this.state
    const haveData = booths && booths.length !== 0

    return (
      <FlatList
        ref={this._flatList}
        data={booths}
        extraData={this.state}
        keyExtractor={(item, index) => item.id + index.toString()}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
        }}
        style={styles.list}
        scrollEnabled={haveData}
        keyboardShouldPersistTaps={'always'}
        onEndReached={() => {
          return this.onScrollHandler()
        }}
        onEndReachedThreshold={0.3}
        windowSize={61}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        updateCellsBatchingPeriod={0}
        bounces={false}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_data, index) => ({
          index,
          length: 200,
          offset: 200 * index,
        })}
      />
    )
  }

  render() {
    const { loading, keyword } = this.state

    return (
      <View style={styles.container}>
        <AHeader4
          placeholder={I18n.t('searchExhibitor')}
          focusPlaceholder={I18n.t('searchExhibitor')}
          value={keyword}
          icon={images.backArrow}
          onPressIcon={this.goBack}
          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
        />

        {loading ? <AIndicator full /> : this.renderFlatList()}
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
  wrapSearch: {
    height: 50,
  },
  inputCustomContainer: {
    height: 50,
    paddingLeft: 16,
    borderBottomColor: colors.white,
  },
  iconRightCustom: {
    tintColor: colors.blue_light_grey,
  },
})
