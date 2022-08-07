import { Product } from '@/models/team'
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
import { searchKeywordDashboard, SearchKeywordType } from '@/services/global'
import { Paging } from '@/paging'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ProductCard } from '@/cards/Product/ProductCard'
import I18n from '@/i18n'
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
  searchResult: Product[]
  numberSearchResult: number
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class MultiSearchProductQuery extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Product>> = React.createRef()
  _navListener = new NavigationService(this.props.navigation)
  _fuse: FuseService<Product> = new FuseService<Product>([] as any)
  _paging: Paging<Product> = new Paging<Product>([] as any)

  _fetchProductSub: Subscription
  _fetchKeywordSub: Subscription

  _after = ''
  _keyword = ''
  _firstTimeLoadProduct = true
  _allResults: Product[] = []

  static defaultProps = {
    fromMultiSearch: false,
    multiTypes: false,
  }

  readonly state: State = {
    loading: true,
    searchResult: [],
    numberSearchResult: 0,
  }

  async componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
      this._flatList.current && this._flatList.current.recordInteraction()
    })
    this.fetchProduct()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._fetchProductSub && this._fetchProductSub.unsubscribe()
    this._fetchKeywordSub && this._fetchKeywordSub.unsubscribe()
  }

  fetchProduct = () => {
    const { productFactory } = this.props
    const [subscription] = productFactory.fetch({})

    this._fetchProductSub = subscription.subscribe(products => {
      /**
       * Update new product list to Fuse
       */
      this.searchUpdate(products)

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

    updateState && updateState('emptyProductSearchResult', state)
  }

  renderHeader = () => {
    const { searchResult } = this.state

    if (searchResult.length <= 0) return null

    return (
      <View style={styles.wrapListHeader}>
        <Text style={styles.title}>{I18n.t('products')}</Text>
      </View>
    )
  }

  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    return (
      <ProductCard
        fromMultiSearchAll={true}
        fromProductList={true}
        product={item}
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
            multiSearchStore.changeTabView(1)
          }}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { loading, searchResult } = this.state

    // if (loading) {
    //   return <AIndicator full />
    // }

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
          bounces={false}
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
