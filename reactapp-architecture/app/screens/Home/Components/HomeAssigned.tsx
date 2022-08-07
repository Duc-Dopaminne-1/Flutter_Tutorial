import * as React from 'react'
import { HomeAssignedItem } from '@/screens/Home/Components/HomeAssignedItem'
import { StyleSheet, View } from 'react-native'
import { colors } from '@/vars'
import I18n from 'react-native-i18n'
import { onProductChange } from '@/services/global'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { Subscription } from 'rxjs'
import Realm from 'realm'
import { Product, Sample, Supplier, Task } from '@/models/team'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { Factory } from '@/services/factory'
import { TasksQuery } from '@/screens/Tasks/TasksQuery'

const defaultProps = {}

type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

type State = Readonly<{
  tasks: Realm.Collection<Task>
  products: Realm.Collection<Product>
  suppliers: Realm.Collection<Supplier>
  samples: Realm.Collection<Sample>
}>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class HomeAssigned extends React.PureComponent<Props, State> {
  _productSubscription: Subscription = null
  _productResults: Realm.Results<Product> = null
  _supplierSubscription: Subscription = null
  _supplierResults: Realm.Results<Supplier> = null
  _samplesSubscription: Subscription = null
  _samplesResults: Realm.Results<Sample> = null
  _tasksSubscription: Subscription = null
  _tasksResults: Realm.Results<Task> = null

  readonly state: State = {
    tasks: [] as any,
    products: [] as any,
    suppliers: [] as any,
    samples: [] as any,
  }

  componentDidMount(): void {
    this.fetchTasks()
    this.fetchProduct()
    this.fetchSamples()
    this.fetchSupplier()
  }

  fetchTasks() {
    const { taskFactory } = this.props
    const query = `assignee.id = "${Factory.user().identity}"`
    const [subscription, results] = taskFactory.fetch({
      query,
    })

    this._tasksResults = results

    this._tasksSubscription = subscription.subscribe(tasks => {
      this.setState({ tasks }, () => {
        this.forceUpdate()
      })
    })
  }

  fetchProduct() {
    const { productFactory } = this.props
    const query = `assignee.id = "${Factory.user().identity}"`
    const [subscription, results] = productFactory.fetch({ query })

    this._productResults = results

    this._productSubscription = subscription.subscribe(data => {
      this.setState({ products: data }, () => {
        this.forceUpdate()
      })
    })
  }

  fetchSamples() {
    const { sampleFactory } = this.props
    const query = `assignee.id = "${Factory.user().identity}"`
    const [subscription, results] = sampleFactory.fetch({
      query,
    })

    this._samplesResults = results

    this._samplesSubscription = subscription.subscribe(data => {
      this.setState({ samples: data }, () => {
        this.forceUpdate()
      })
    })
  }

  fetchSupplier() {
    const { supplierFactory } = this.props
    const query = `assignee.id = "${Factory.user().identity}"`
    const [subscription, results] = supplierFactory.fetch({ query })

    this._supplierResults = results

    this._supplierSubscription = subscription.subscribe(data => {
      this.setState({ suppliers: data }, () => {
        this.forceUpdate()
      })
    })
  }

  componentWillUnmount() {
    this._tasksResults && this._tasksResults.removeAllListeners()
    this._tasksSubscription && this._tasksSubscription.unsubscribe()
    this._productResults && this._productResults.removeAllListeners()
    this._productSubscription && this._productSubscription.unsubscribe()
    this._supplierResults && this._supplierResults.removeAllListeners()
    this._supplierSubscription && this._supplierSubscription.unsubscribe()
    this._samplesResults && this._samplesResults.removeAllListeners()
    this._samplesSubscription && this._samplesSubscription.unsubscribe()
  }

  onPressItem = (key: 'task' | 'sample' | 'product' | 'supplier') => () => {
    const { navigate } = this.props.navigation
    switch (key) {
      case 'task':
        navigate('TasksScreen')
        break
      case 'sample':
        navigate('SampleListScreen')
        break
      case 'product':
        navigate('ProductScreen')
        break
      case 'supplier':
        navigate('SupplierScreen')
        break
      default:
        break
    }
  }

  render() {
    const { products, suppliers, tasks, samples } = this.state
    return (
      <View style={styles.container}>
        <HomeAssignedItem
          isShowDot={false}
          title={I18n.t('tasks').toUpperCase()}
          total={tasks.length}
          container={styles.wrapContainer}
          wrapItem={styles.wrapItem}
          isSeparate={true}
          onPressItem={this.onPressItem('task')}
        />
        <HomeAssignedItem
          isShowDot={false}
          title={I18n.t('productsUpCase').toUpperCase()}
          total={products.length}
          container={styles.wrapContainer}
          wrapItem={styles.wrapItem}
          isSeparate={true}
          onPressItem={this.onPressItem('product')}
        />
        <HomeAssignedItem
          isShowDot={false}
          title={I18n.t('samples').toUpperCase()}
          total={samples.length}
          container={styles.wrapContainer}
          wrapItem={styles.wrapItem}
          isSeparate={true}
          onPressItem={this.onPressItem('sample')}
        />
        <HomeAssignedItem
          isShowDot={false}
          title={I18n.t('suppliersUpCase').toUpperCase()}
          total={suppliers.length}
          isSeparate={false}
          onPressItem={this.onPressItem('supplier')}
          container={styles.wrapContainer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  wrapContainer: {},
  wrapItem: {},
})
