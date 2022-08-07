import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { Product, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoForm } from '@/screens/SupplierInfo/Components/SupplierInfoForm'
import { SupplierInfoProductCard } from '@/screens/SupplierInfo/Components/SupplierInfoProductCard'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'

// init state
const initialState = {
  products: [] as any,
  loading: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  tabLabel: string
  supplier: Supplier
}> &
  DefaultProps &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  products: Realm.Collection<Product>
  loading: boolean
}>

@DelayRender({ delay: 400 })
@withContext(SupplierInfoContext.Consumer)
@withContext(AppContext.Consumer)
export class SupplierInfoProduct extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _subSubscription: Subscription
  _results: Realm.Results<Product>

  readonly state: State = initialState

  static navigationOptions = {
    header: null,
  }

  componentDidMount(): void {
    const { supplier, productFactory } = this.props

    const query = `supplier.id = "${supplier.id}"`
    const [subscription, results] = productFactory.fetch({ query })

    this._results = results

    this._subscription = subscription.subscribe(products => {
      this.setState(
        {
          products,
        },
        () => {
          this.forceUpdate()
        }
      )
    })

    this._subSubscription = productFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
        })
      }
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  renderItem = ({ item }) => {
    return <SupplierInfoProductCard product={item} />
  }

  render() {
    const { products, loading } = this.state

    if (loading) {
      return <AIndicator full />
    }

    return (
      <SupplierInfoForm>
        <ATitle title={I18n.t('products')} />

        <View style={styles.container}>
          <FlatList<Product>
            data={products}
            extraData={this.state}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContainer}
          />
        </View>
      </SupplierInfoForm>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    justifyContent: 'space-between',
  },
})
