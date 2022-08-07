import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierContext } from '@/screens/Supplier/SupplierContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import {
  scrollTabViewSupplier,
  searchKeyword,
  SearchKeywordType,
} from '@/services/global'
import { Paging } from '@/paging'
import { eventStore } from '@/stores/eventStore'
import { SafeEvent } from '@/shared/event'
import { Booth } from '@/models/global'
import { GlobalSupplierCard } from '@/cards/Supplier/GlobalSupplierCard'
import { SafeBooth } from '@/shared/booth'
import { isIpad } from '@/shared/devices'
import { globalSupplierStore } from '@/stores/globalSupplierStore'
import { debounce } from 'lodash'
import { supplierStore } from '@/stores/supplierStore'
import { SupplierExhibitorEmpty } from '@/screens/Supplier/Components/SupplierExhibitorEmpty'

type Props = Readonly<{
  type?: SearchKeywordType
  query?: string
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  booths: Realm.Collection<Booth>
  loading: boolean
  selectedId: string
  listId: String[]
  firstTimeLoadData: boolean
}>

@withContext(SupplierContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SupplierQueryGlobal extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<any>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription
  _subSubscription: Subscription
  _updateItemSubSubscription: Subscription
  _updateEventSub: Subscription
  _fuse: FuseService<Booth> = new FuseService<Booth>([] as any)
  _results: Realm.Collection<Booth> = [] as any
  _listIDSubscription: Subscription
  _updateKeywordSubscription: Subscription
  _paging: Paging<Booth> = new Paging<Booth>([] as any)
  _after: string = null
  _keyword: string = ''
  _eventId: string = ''
  _pagingSearch: Paging<Booth> = new Paging<Booth>([] as any)
  _afterSearch: string = null

  readonly state: State = {
    booths: [] as any,
    loading: true,
    selectedId: '',
    listId: [],
    firstTimeLoadData: true,
  }

  async componentDidMount() {
    this._navListener.setBarStyle('light-content')

    if (eventStore.currentEventGlobalId) {
      this._eventId = eventStore.currentEventGlobalId
      this.fetchSupplier(eventStore.currentEventGlobalId)
    }

    this._updateEventSub = eventStore.updateEventSub.subscribe(data => {
      /**
       * If don't have data then don't do anything
       */
      if (!data) return

      const { eventId } = new SafeEvent(data)
      if (this._eventId !== eventId) {
        this._eventId = eventId
        this.fetchSupplier(eventId)
      }
    })

    this.fetchMySupplierListId()
    this.fetchSearchKeyword()
    this.updateItemSubscription()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._updateEventSub && this._updateEventSub.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._updateItemSubSubscription &&
      this._updateItemSubSubscription.unsubscribe()
  }

  fetchSupplier = eventId => {
    const { globalEventFactory } = this.props
    const [subscription] = globalEventFactory.fetchById(eventId)

    this._subscription && this._subscription.unsubscribe()

    this._subscription = subscription.subscribe(event => {
      const { booths } = new SafeEvent(event)

      const sortBooth =
        booths && booths.sorted ? booths.sorted('supplier.name') : []

      globalSupplierStore.initSelect = true
      this._paging.update(sortBooth as any)
      const newBooths = this._paging.next(null, 30)
      this._after = this._paging.getLatestId(newBooths)
      this.resultUpdate(newBooths)
      this.searchUpdate(sortBooth, this.state.firstTimeLoadData)

      if (this._keyword.trim().length === 0) {
        this.setState(
          {
            booths: newBooths,
            loading: false,
            firstTimeLoadData: false,
          },
          () => {
            // this.forceUpdate()
            searchKeyword.next({ text: '', type: this.props.type })
          }
        )
      }
    })

    this._subSubscription = globalEventFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({ loading: false })
      }
    })
  }

  fetchMySupplierListId = () => {
    this.setState({
      listId: supplierStore.supplierListId,
    })

    this._listIDSubscription = supplierStore.supplierListIdSub.subscribe(
      listId => {
        this.setState({ listId })
      }
    )
  }

  fetchSearchKeyword = () => {
    this._updateKeywordSubscription = searchKeyword.subscribe(data => {
      if (data.type === this.props.type) {
        this.onChangeText(data.text)
      }
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
    const { booths } = this.state

    if (!this._paging.isEnd(this._after) && this._keyword.trim().length === 0) {
      const nextBooths = this._paging.next(this._after)
      const newBooths = booths.concat(nextBooths)

      this._after = this._paging.getLatestId(nextBooths)
      this.resultUpdate(newBooths)

      this.setState({
        booths: newBooths as any,
      })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      this._keyword.trim().length > 0
    ) {
      const nextBooths = this._pagingSearch.next(this._afterSearch)
      const newBooths = booths.concat(nextBooths)

      this._afterSearch = this._paging.getLatestId(nextBooths)

      this.setState({
        booths: newBooths as any,
      })
    }
  }

  onScroll = event => {
    scrollTabViewSupplier.next({
      y: event.nativeEvent.contentOffset.y,
      type: 'Supplier',
      flatListRef: this._flatList,
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword
      this.setState({
        booths: this._results,
      })
      return
    }

    this._keyword = keyword
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
        onScroll={this.onScroll}
        scrollEnabled={haveData}
        keyboardShouldPersistTaps={'always'}
        onEndReached={this.onScrollHandler}
        onEndReachedThreshold={0.5}
        windowSize={31}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        bounces={false}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  render() {
    const { loading, booths } = this.state

    if (!loading && booths.length <= 0) {
      return <SupplierExhibitorEmpty />
    }

    return (
      <View style={styles.container}>
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
