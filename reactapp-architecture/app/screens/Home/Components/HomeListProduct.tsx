import { AForm } from '@/components/AForm/AForm'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { HomeListProductCard } from '@/screens/Home/Components/HomeListProductCard'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import {
  NavigationInjectedProps,
  NavigationParams,
  withNavigation,
} from 'react-navigation'
import { Subscription } from 'rxjs'
import { HomeFormButton } from './HomeFormButton'
import { ProductCardFooter } from '@/cards/Product/ProductCardFooter'
import { onProductChange } from '@/services/global'
import { SafeProduct } from '@/shared/product'
import Realm from 'realm'
import { ProductEmpty } from '@/screens/Product/Components/ProductEmpty'
import { ProductEmpty2 } from '@/screens/Product/Components/ProductEmpty2'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  products: Realm.Collection<Product>
  loading: boolean
  loadingFull: boolean
}>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class HomeListProduct extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Product>> = React.createRef()
  _subscription: Subscription = null
  _subSubscription: Subscription = null
  _results: Realm.Results<Product> = null
  _subscriptionNetWork: Subscription = null

  readonly state: State = {
    products: [] as any,
    loading: true,
    loadingFull: true,
  }

  componentDidMount() {
    const { productFactory } = this.props

    this._subscriptionNetWork = this.props.connection
      .observer()
      .subscribe(_value => {
        this.setState({}, () => {
          this.forceUpdate()
        })
      })

    const [subscription, results] = productFactory.fetch({
      skip: 0,
      limit: 10,
      isReceiveChange: true,
    })

    this._results = results

    this._subscription = subscription.subscribe(data => {
      if (data.col.length >= 0) {
        data.change.modifications.forEach(item => {
          onProductChange.next(item)
        })

        this.setState(
          {
            products: data.col,
            loading: false,
          },
          () => {
            // this.forceUpdate()
          }
        )
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

  componentWillUnmount(): void {
    this._subscriptionNetWork && this._subscriptionNetWork.unsubscribe()
    this._subscription && this._subscription.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  renderItem = ({ item, index }: { item: Product; index: number }) => {
    if (!item || !item.isValid() || item.deleted) return null

    const { name, id } = new SafeProduct(item)

    return (
      <HomeListProductCard
        product={item}
        currentIndex={index}
        onPress={() => {
          this.navigateTo('ProductInfoScreen', {
            productName: name,
            productId: id,
            wasCreated: true,
          })
        }}
      />
    )
  }

  navigateTo = (routeName: string, params?: NavigationParams) => {
    this.props.navigation.navigate(routeName, params)
  }

  viewAll = () => {
    this.navigateTo('ProductScreen')
  }

  renderFooter = () => {
    const { loadingFull, loading } = this.state
    return <ProductCardFooter loading={loadingFull && !loading} />
  }

  render() {
    const { products, loading, loadingFull } = this.state

    const isLoading = loading && loadingFull

    if (!isLoading) {
      setTimeout(() => {
        this._flatList.current && this._flatList.current.recordInteraction()
      }, 50)
    }

    if (products.length === 0) {
      return (
        <View style={styles.container}>
          <AForm
            title={I18n.t('latestProducts')}
            subTitle={I18n.t('viewAll')}
            onPress={this.viewAll}
            titleContainer={styles.titleContainer}
            contentStyle={styles.contentStyle}
            containerStyle={styles.containerStyle}
            textLabelStyle={styles.textLabelStyle}
            titleButton={styles.titleButton}
          >
            <ProductEmpty2 />
          </AForm>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <AForm
          title={I18n.t('latestProducts')}
          subTitle={I18n.t('viewAll')}
          onPress={this.viewAll}
          titleContainer={styles.titleContainer}
          contentStyle={styles.contentStyle}
          containerStyle={styles.containerStyle}
          textLabelStyle={styles.textLabelStyle}
          titleButton={styles.titleButton}
        >
          <FlatList<Product>
            data={products}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            extraData={products}
            showsHorizontalScrollIndicator={false}
            // ListFooterComponent={this.renderFooter}
            // ListEmptyComponent={this.renderEmpty}
            horizontal={true}
          />
        </AForm>

        <View style={styles.cross} />

        <HomeFormButton
          onViewAll={this.viewAll}
          onAddNew={() => this.navigateTo('CameraScreen')}
          buttonTwoTitle={I18n.t('createNewProduct')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.keylines_screen_product_info_margin,
    marginBottom: 50,
    backgroundColor: colors.background_gray,
  },
  titleContainer: {
    marginBottom: metrics.home_screen_products_title_container_margin_bottom,
    marginTop: metrics.home_screen_products_title_container_margin_top,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingLeft: metrics.home_screen_products_title_header_padding_left,
    paddingRight: metrics.home_screen_products_title_header_padding_right,
  },
  containerStyle: {
    marginTop: 0,
  },
  contentStyle: {
    paddingHorizontal:
      metrics.home_screen_products_contentstyle_padding_horizontal,
  },
  textLabelStyle: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.xl,
    fontWeight: '600',
  },
  titleButton: {
    fontFamily: fonts.family.SSPSemiBold,
  },
  cross: {
    borderBottomColor: colors.pale_grey,
    borderBottomWidth: metrics.home_screen_products_cross_border_bottom_width,
  },
})
