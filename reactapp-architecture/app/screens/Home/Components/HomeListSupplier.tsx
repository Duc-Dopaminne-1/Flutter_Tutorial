import { AForm } from '@/components/AForm/AForm'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Subscription } from 'rxjs'
import { HomeFormButton } from './HomeFormButton'
import { HomeListSupplierList } from './HomeListSupplierList'
import { colors, fonts, metrics } from '@/vars'
import {
  createSupplierNavigation,
  CreateSupplierRef,
} from '@/navigation/createSupplierNavigation'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { onSupplierChange } from '@/services/global'
import Realm from 'realm'

type HomeLatestSupplierProps = Readonly<{}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type HomeLatestSupplierState = Readonly<{
  suppliers: Realm.Results<Supplier>
  loading: boolean
  loadingFull: boolean
}>

@DelayRender({ delay: 100 })
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class HomeListSupplier extends React.PureComponent<
  HomeLatestSupplierProps,
  HomeLatestSupplierState
> {
  _flatList: React.RefObject<FlatList<Supplier>> = React.createRef()
  _results: Realm.Results<Supplier>
  _subscription: Subscription
  _subSubscription: Subscription

  readonly state: HomeLatestSupplierState = {
    suppliers: [] as any,
    loading: true,
    loadingFull: true,
  }

  componentDidMount() {
    const { supplierFactory } = this.props

    if (!supplierFactory) return

    const [subscription, results] = supplierFactory.fetch({
      skip: 0,
      limit: 10,
      descriptor: 'creationDate',
      reverse: true,
      isReceiveChange: true,
    })

    this._results = results

    this._subscription = subscription.subscribe((data: any) => {
      if (data.col.length >= 0) {
        data.change.modifications.forEach(index => {
          onSupplierChange.next({
            index,
            data: data.col[index],
          })
        })

        this.setState(
          {
            suppliers: data.col,
            loading: false,
          },
          () => {
            this.forceUpdate()
          }
        )
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

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  navigateTo = (routeName: string) => {
    this.props.navigation.navigate(routeName)
  }

  viewAll = () => {
    this.navigateTo('SupplierScreen')
  }

  onPressCreate = () => {
    // this._createSupplierModal.current.open()
    createSupplierNavigation.open(CreateSupplierRef.Create)
  }

  render() {
    const { suppliers, loading, loadingFull } = this.state

    // const isLoading = loading && loadingFull

    // if (loading) {
    //   return <AIndicator full />
    // }

    if (!loading) {
      setTimeout(() => {
        this._flatList.current && this._flatList.current.recordInteraction()
      }, 50)
    }

    return (
      <View style={styles.container}>
        <AForm
          title={I18n.t('latestSuppliers')}
          subTitle={I18n.t('viewAll')}
          onPress={this.viewAll}
          titleContainer={styles.titleContainer}
          textLabelStyle={styles.textLabelStyle}
          titleButton={styles.titleButton}
          contentStyle={styles.contentStyle}
        >
          <HomeListSupplierList
            suppliers={suppliers}
            isLoading={loadingFull && !loading}
          />
        </AForm>
        <HomeFormButton
          onViewAll={this.viewAll}
          onAddNew={this.onPressCreate}
          buttonTwoTitle={I18n.t('createNewSupplier')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: metrics.home_screen_suppliers_padding_bottom,
  },
  textLabelStyle: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.xl,
    fontWeight: '600',
  },
  titleButton: {
    fontFamily: fonts.family.SSPSemiBold,
  },
  titleContainer: {
    marginBottom: metrics.home_screen_suppliers_title_container_margin_bottom,
    marginTop: metrics.home_screen_suppliers_title_container_margin_top,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
    paddingLeft: metrics.home_screen_suppliers_title_header_padding_left,
    paddingRight: metrics.home_screen_suppliers_title_header_padding_right,
  },
  contentStyle: {
    paddingHorizontal: 0,
  },
})
