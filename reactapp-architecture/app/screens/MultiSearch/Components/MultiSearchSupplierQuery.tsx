import { Product, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics, normalize } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Subscription } from 'rxjs'
import {
  scrollTabView,
  searchKeywordDashboard,
  SearchKeywordType,
} from '@/services/global'
import { Paging } from '@/paging'
import { ProductCardSeparator } from '@/cards/Product/ProductCardSeparator'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { SupplierCard } from '@/cards/Supplier/SupplierCard'
import I18n from '@/i18n'
import { AButton } from '@/components/AButton/AButton'
import { multiSearchStore } from '@/stores/MultiSearchStore'

type Props = Readonly<{
  multiTypes?: boolean
  type?: SearchKeywordType
  fromMultiSearch?: boolean
  updateState: (key: string, data: boolean) => void
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  loading: boolean
  selected: boolean
  searchResult: Supplier[]
  numberSearchResult: number
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class MultiSearchSupplierQuery extends React.PureComponent<
  Props,
  State
> {
  _flatList: React.RefObject<FlatList<Supplier>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _fuse: FuseService<Supplier> = new FuseService<Supplier>([] as any)
  _paging: Paging<Supplier> = new Paging<Supplier>([] as any)

  fetchSupplierSub: Subscription
  _fetchKeywordSub: Subscription

  _after = ''
  _keyword = ''
  _firstTimeLoadProduct = true
  _allResults: Supplier[] = []

  static defaultProps = {
    fromMultiSearch: false,
    multiTypes: false,
  }

  readonly state: State = {
    selected: false,
    loading: true,
    searchResult: [],
    numberSearchResult: 0,
  }

  async componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
      this._flatList.current && this._flatList.current.recordInteraction()
    })
    this.fetchSupplier()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this.fetchSupplierSub && this.fetchSupplierSub.unsubscribe()
    this._fetchKeywordSub && this._fetchKeywordSub.unsubscribe()
  }

  fetchSupplier = () => {
    const { supplierFactory } = this.props
    const [subscription] = supplierFactory.fetch({})

    this.fetchSupplierSub = subscription.subscribe(suppliers => {
      /**
       * Update new supplier list to Fuse
       */
      this.searchUpdate(suppliers)

      /**
       * Turn off loading indicator.
       */
      this.setState({
        loading: false,
      })
    })
  }

  fetchSearchKeyword = () => {
    this._fetchKeywordSub = searchKeywordDashboard.subscribe(data => {
      this.onChangeText(data.text)
    })
  }

  searchUpdate = products => {
    if (!this._firstTimeLoadProduct) {
      this._fuse.update(products)
      return
    }

    this._firstTimeLoadProduct = false
    this._fuse = new FuseService<Supplier>(products, {
      keys: ['name', 'fullName'] as any,
    })
    this.fetchSearchKeyword()
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this._keyword = keyword
      this._allResults = []
      this.setState({
        searchResult: [],
        numberSearchResult: 0,
      })

      this.updateStateOutSide(true)

      return
    }

    this._keyword = keyword
    this.onSearch(keyword)
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.updateStateOutSide(true)
      return
    }

    this._allResults = this._fuse.search(keyword.trim()).data

    this.updateStateOutSide(this._allResults.length <= 0)

    if (this._allResults.length > 5) {
      this.setState({
        numberSearchResult: this._allResults.length - 5,
        searchResult: this._allResults.slice(0, 5),
      })
    } else {
      this.setState({
        searchResult: this._allResults,
        numberSearchResult: 0,
      })
    }
  }

  updateStateOutSide = (state: boolean) => {
    const { updateState } = this.props

    updateState && updateState('emptySupplierSearchResult', state)
  }

  renderHeader = () => {
    const { searchResult } = this.state

    if (searchResult.length <= 0) return null

    return (
      <View style={styles.wrapListHeader}>
        <Text style={styles.title}>{I18n.t('suppliers')}</Text>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    return (
      <SupplierCard
        fromMultiSearchAll={true}
        fromSupplierList={true}
        supplier={item}
        selected={false}
        currentIndex={index}
      />
    )
  }

  renderFooter = () => {
    const { searchResult, numberSearchResult } = this.state

    if (numberSearchResult <= 0 || searchResult.length <= 0) return null

    const title = I18n.t('viewMoreResult', {
      number: numberSearchResult,
    })

    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            multiSearchStore.changeTabView(2)
          }}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { loading, searchResult } = this.state

    if (loading) {
      return <AIndicator full />
    }

    return (
      <View style={styles.container}>
        <FlatList
          ref={this._flatList}
          data={searchResult}
          extraData={searchResult}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          style={styles.list}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
        />
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
  wrapListHeader: {
    marginTop: metrics.keylines_screen_profile_title_margin,
    paddingBottom: metrics.keylines_screen_product_info_margin,
  },
  title: {
    marginLeft: metrics.keylines_screen_product_info_margin,
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButton: {
    height: normalize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.primary_blue,
  },
})
